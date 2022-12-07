import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateAlbumDto, UpdateAlbumDto } from 'src/album/dto';
import { Public } from 'src/common/decorators';
import { AlbumService } from './album.service';

@Controller('album')
export class AlbumController {
    constructor (private albumService: AlbumService) {}

    @Public()
    @Post()
    create(@Body() createAlbumDto: CreateAlbumDto) {
        return this.albumService.create(createAlbumDto)
    }

    // @Public()
    @Get()
    getAll() {
        return this.albumService.getAll()
    }

    @Public()
    @Get(':id')
    getOne(@Param('id') id: number) {
        return this.albumService.getOne(id)
    }

    @Public()
    @Put(':id')
    update(@Param('id') id: number, @Body() updateAlbumDto: UpdateAlbumDto) {
        return this.albumService.update(id, updateAlbumDto)
    }

    @Public()
    @Delete(':id')
    deleted(@Param('id') id: number) {
        return this.albumService.deleted(id)
    }
}
