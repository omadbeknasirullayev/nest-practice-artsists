import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { ArtistService } from './artist.service';
import { CreateArtistDto, UpdateArtistDto } from './dto';

@Controller('artist')
export class ArtistController {
    constructor (private artistService: ArtistService) {}

    @Public()
    @Post()
    create(@Body() createArtistDto: CreateArtistDto) {
        return this.artistService.create(createArtistDto)
    }

    // @Public()
    @Get()
    getAll() {
        return this.artistService.getAll()
    }

    @Public()
    @Get(':id')
    getOne(@Param('id') id: number) {
        return this.artistService.getOne(id)
    }

    @Public()
    @Put(':id')
    update(@Param('id') id: number, @Body() updateArtistDto: UpdateArtistDto) {
        return this.artistService.update(id, updateArtistDto)
    }

    @Public()
    @Delete(':id')
    deleted(@Param('id') id: number) {
        return this.artistService.deleted(id)
    }
}
