import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    controllers: [FilesController],
    providers: [FilesService]
})
export class FilesModule {}
