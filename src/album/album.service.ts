import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';

@Injectable()
export class AlbumService {
    constructor(private prismaService: PrismaService) {}

  async create(createAlbumdto: CreateAlbumDto) {
    const album = await this.prismaService.album.create({
      data: createAlbumdto,
    });
    console.log(album);
    return album;
  }

  async getAll() {
    const albums = await this.prismaService.album.findMany();
    return albums;
  }

  async getOne(id: number) {
    const album = await this.prismaService.album.findFirst({
      where: { albumId: +id },
    });
    if (!album)
      throw new HttpException('Bunday album topilmadi', HttpStatus.NOT_FOUND);
    return album;
  }


  async update(id: number, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.prismaService.album.updateMany({
      where: { albumId: +id },
      data: updateAlbumDto,
    });

    if (album.count == 0)
      throw new HttpException('Bunday album topilmadi', HttpStatus.NOT_FOUND);

    return {message: "Muvaffaqiyatli Amalga oshirildi"};
  }

  async deleted (id: number) {
    const deleted = await this.prismaService.album.delete({where: {albumId: +id}})
    return {message: "Muvaffaqiyatli o'chirildi"}
  }
  
}
