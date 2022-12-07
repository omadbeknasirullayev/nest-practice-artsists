import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenGuard } from 'src/common/guards';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import {
  AccessTokenStrategy,
  RefreshTokenFromBearerStrategy,
  RefreshTokenFromCookieStrategy,
} from './strategies';

@Module({
  imports: [JwtModule.register({}), PrismaModule],
  controllers: [AdminController],
  providers: [
    AdminService,
    AccessTokenStrategy,
    // RefreshTokenFromBearerStrategy,
    RefreshTokenFromCookieStrategy,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AdminModule {}
