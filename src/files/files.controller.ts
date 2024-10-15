import { Controller, Post, UploadedFile, UseInterceptors,  ParseFilePipe, MaxFileSizeValidator, FileTypeValidator,  Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import * as multer from 'multer';
import { join } from 'path';
import { mkdirSync } from 'fs';
import { Response } from 'express';

const uploadPath = join(__dirname, '..', '..', 'uploads');
mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); 
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); 
  },
});

@Controller('upload')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage })) // 'file' is the name of the form field
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1_000_000 }), 
          new FileTypeValidator({ fileType: /(image\/png|image\/jpeg|image\/jpg)/ }), 
        ],
      }),
    )
    file: Express.Multer.File,
  ) {

    console.log('File received:', file); 
    console.log('File uploaded to:', join(uploadPath, file.originalname));
    await this.filesService.upload(file.originalname, file.buffer);
    return { message: 'File uploaded successfully!' };
  }

  @Get(':filename')
  async downloadFile(@Param('filename') filename: string, @Res() res: Response) {
  const filePath = join(uploadPath, filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      return res.status(404).send('File not found');
    }
  });
}
}