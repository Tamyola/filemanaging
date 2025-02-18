import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { FilesController } from '../files/files.controller';
import { FilesService } from '../files/files.service';
import { File, FileSchema } from '../files/file.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule], 
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/filemanaging', // MongoDB connection URI
      }),
    }),

    MongooseModule.forFeature([{name: File.name, schema: FileSchema }]),
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class AppModule {}