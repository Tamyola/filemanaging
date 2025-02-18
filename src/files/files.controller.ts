import { Controller, Post, Get, Param, UseInterceptors, UploadedFile, NotFoundException, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { File } from './file.schema';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueFilename = `${Date.now()}-${file.originalname}`;
          callback(null, uniqueFilename);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileData = {
      filename: file.filename,
      path: `/uploads/${file.filename}`,
      mimetype: file.mimetype, 
      size: file.size,          
    };

    const savedFile = await this.filesService.createFile(fileData);

    return savedFile;
  }

  @Get(':id')
  async getFile(@Param('id') id: string): Promise<File | null> {
    return this.filesService.findFileById(id);
  }

  @Get()
  async getAllFiles(): Promise<File[]> {
    return this.filesService.findAllFiles();
  }


  // File Download
  @Get('download/:filename')
  async downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(process.cwd(), 'uploads', filename);


    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    return res.download(filePath);
  }
}
