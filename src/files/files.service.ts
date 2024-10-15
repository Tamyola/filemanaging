import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FilesService {
    private readonly s3Client = new S3Client({ 
        region: this.configService.getOrThrow("AWS_S3_REGION"),
    })

    constructor(private readonly configService: ConfigService) {}

    async upload (fileName: string, file: Buffer) {
        await this.s3Client.send (
            new PutObjectCommand({
                Bucket: 'filecontrols',
                Key: fileName,
                Body: file,
            }),
        );
    }
}    




