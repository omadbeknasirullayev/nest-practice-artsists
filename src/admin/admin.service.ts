import {
    BadRequestException,
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import * as bcrypt from 'bcryptjs';
  import { Response } from 'express';
  import { PrismaService } from 'src/prisma/prisma.service';
  import { AdminDto } from './dto';
  import { JwtPayload, Tokens } from './types';
  
  @Injectable()
  export class AdminService {
    constructor(
      private prismaService: PrismaService,
      private jwtService: JwtService,
    ) {}
  
    //=========================================================================================
    // signup admin ro'yhatdan o'tish
    //=========================================================================================
  
    async signup(adminDto: AdminDto, res: Response): Promise<Tokens> {
      const candidate = await this.prismaService.admin.findUnique({
        where: { email: adminDto.email },
      });
      if (candidate) throw new BadRequestException('Bunday email mavjud');
  
      const hashedPassword = await bcrypt.hash(adminDto.password, 7);
      const newAdmin = await this.prismaService.admin.create({
        data: { email: adminDto.email, hashedPassword },
      });
  
      const tokens = await this.getTokens(newAdmin.id, newAdmin.email);
      await this.updateRefreshTokenHash(newAdmin.id, tokens.refresh_token);
  
      res.cookie('refresh_token', tokens.refresh_token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return tokens;
    }
  
    //=========================================================================================
    // signin admin
    //=========================================================================================
  
    async signin(adminDto: AdminDto, res: Response): Promise<Tokens> {
      const { email, password } = adminDto;
      const admin = await this.prismaService.admin.findUnique({
        where: { email },
      });
      if (!admin) throw new ForbiddenException('Access Denied');
  
      const passwordMatches = await bcrypt.compare(password, admin.hashedPassword);
      if (!passwordMatches) throw new ForbiddenException('Access Denied');
  
      const tokens = await this.getTokens(admin.id, admin.email);
      await this.updateRefreshTokenHash(admin.id, tokens.refresh_token);
  
      res.cookie('refresh_token', tokens.refresh_token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
  
      return tokens;
    }
  
    //=========================================================================================
    // logout admin
    //=========================================================================================
  
    async logout(id: number, res: Response): Promise<boolean> {
      const admin = await this.prismaService.admin.updateMany({
        where: {
          id: +id,
          hashedRefreshToken: {
            not: null,
          },
        },
        data: {
          hashedRefreshToken: null,
        },
      });
      if (!admin) throw new ForbiddenException('Access Denied');
      res.clearCookie('refresh_token');
      return true;
    }
  
    async getTokens(adminId: number, email: string): Promise<Tokens> {
      const jwtPayload: JwtPayload = {
        sub: adminId,
        email: email,
      };
  
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(jwtPayload, {
          secret: process.env.ACCESS_TOKEN_KEY,
          expiresIn: process.env.ACCESS_TOKEN_TIME,
        }),
  
        this.jwtService.signAsync(jwtPayload, {
          secret: process.env.REFRESH_TOKEN_KEY,
          expiresIn: process.env.REFRESH_TOKEN_TIME,
        }),
      ]);
  
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    }
  
    async updateRefreshTokenHash(
      adminId: number,
      refreshToken: string,
    ): Promise<void> {
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);
      await this.prismaService.admin.update({
        where: {
          id: adminId,
        },
        data: {
          hashedRefreshToken: hashedRefreshToken,
        },
      });
    }
  
    async refreshTokens(
      adminId: number,
      refreshToken: string,
      res: Response,
    ): Promise<Tokens> {
      const admin = await this.prismaService.admin.findUnique({
        where: { id: adminId },
      });
  
      if (!admin || !admin.hashedRefreshToken)
        throw new ForbiddenException('Access Denied');
  
      const rtMatches = await bcrypt.compare(
        refreshToken,
        admin.hashedRefreshToken,
      );
  
      if (!rtMatches) throw new ForbiddenException('Access Denied');
  
      const tokens = await this.getTokens(admin.id, admin.email);
      await this.updateRefreshTokenHash(admin.id, tokens.refresh_token);
  
      res.clearCookie('refresh_token');
      res.cookie('refresh_token', tokens.refresh_token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
  
      return tokens;
    }
  }
  