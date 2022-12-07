import { Module } from '@nestjs/common';

import { AdminModule } from './admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AlbumModule } from './album/album.module';
import { ArtistModule } from './artist/artist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    PrismaModule,
    AdminModule,
    AlbumModule,
    ArtistModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
