import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Res,
    UseGuards,
  } from '@nestjs/common';
  import { Response } from 'express';
  import {
    GetCurrentUser,
    GetCurrentUserId,
    Public,
  } from 'src/common/decorators';
  import { RefreshTokenGuard } from 'src/common/guards';
  import { AdminService } from './admin.service';
  import { AdminDto } from './dto';
  import { Tokens } from './types';
  
  @Controller('admin')
  export class AdminController {
    constructor(private readonly adminService: AdminService) {}
  
    @Public()
    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    signup(
      @Body() adminDto: AdminDto,
      @Res({ passthrough: true }) res: Response,
    ): Promise<Tokens> {
      return this.adminService.signup(adminDto, res);
    }
  
    @Public()
    @Post('signin')
    @HttpCode(HttpStatus.OK)
    async signin(
      @Body() adminDto: AdminDto,
      @Res({ passthrough: true }) res: Response,
    ): Promise<Tokens> {
      return await this.adminService.signin(adminDto, res);
    }
  
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(
      @GetCurrentUserId() userId: number,
      @Res({ passthrough: true }) res: Response,
    ): Promise<boolean> {
      res.clearCookie('refresh_token');
      return this.adminService.logout(userId, res);
    }
  
    @Public()
    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refreshTokens(
      @GetCurrentUserId() userId: number,
      @GetCurrentUser('refreshToken') refreshToken: string,
      @Res({ passthrough: true }) res: Response,
    ): Promise<Tokens> {
      return this.adminService.refreshTokens(userId, refreshToken, res);
    }
  }
  