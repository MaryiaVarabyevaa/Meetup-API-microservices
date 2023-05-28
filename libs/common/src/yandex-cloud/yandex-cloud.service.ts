import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class YandexCloudService {
    private readonly s3: S3;

    constructor(private readonly configService: ConfigService) {
        this.s3 = new S3({
            accessKeyId: this.configService.get<string>('YC_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get<string>('YC_SECRET_ACCESS_KEY'),
            region: this.configService.get<string>('YC_REGION'),
            endpoint: this.configService.get<string>('YC_ENDPOINT'),
        });
    }

    async uploadFile(
        buffer: Buffer,
        fileName: string,
        contentType: string,
    ): Promise<string> {
        const fileId = uuidv4();
        const fileKey = `${fileId}/${fileName}`;

        await this.s3
            .putObject({
                Bucket: this.configService.get<string>('YC_BUCKET_NAME'),
                Key: fileKey,
                Body: buffer,
                ContentType: contentType,
            })
            .promise();

        return this.getDownloadUrl(fileId, fileName);
    }

    getDownloadUrl(fileId: string, fileName: string): string {
        const fileKey = `${fileId}/${fileName}`;
        const signedUrl = this.s3.getSignedUrl('getObject', {
            Bucket: this.configService.get<string>('YC_BUCKET_NAME'),
            Key: fileKey,
            Expires: 60 * 60, // ссылка будет активна в течение 1 часа
        });

        return signedUrl;
    }
}
