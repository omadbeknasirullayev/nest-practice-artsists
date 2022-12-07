import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArtistDto, UpdateArtistDto } from './dto';

@Injectable()
export class ArtistService {
  constructor(private prismaService: PrismaService) {}

  async create(createArtistdto: CreateArtistDto) {
    const artist = await this.prismaService.artist.create({
      data: createArtistdto,
    });
    console.log(artist);
    return artist;
  }

  async getAll() {
    const artists = await this.prismaService.artist.findMany();
    return artists;
  }

  async getOne(id: number) {
    const artist = await this.prismaService.artist.findFirst({
      where: { artistId: +id },
    });
    if (!artist)
      throw new HttpException('Bunday artist topilmadi', HttpStatus.NOT_FOUND);
    return artist;
  }


  async update(id: number, updateArtistDto: UpdateArtistDto) {
    const artist = await this.prismaService.artist.updateMany({
      where: { artistId: +id },
      data: updateArtistDto,
    });

    if (artist.count == 0)
      throw new HttpException('Bunday artist topilmadi', HttpStatus.NOT_FOUND);

    return {message: "Muvaffaqiyatli Amalga oshirildi"};
  }

  async deleted (id: number) {
    const deleted = await this.prismaService.artist.delete({where: {artistId: +id}})
    return {message: "Muvaffaqiyatli o'chirildi"}
  }
  
}
