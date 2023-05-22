// // yandex-cloud.service.ts
// import { S3 } from 'aws-sdk';
//
// const s3 = new S3({
//     accessKeyId: process.env.YANDEX_CLOUD_ACCESS_KEY_ID,
//     secretAccessKey: process.env.YANDEX_CLOUD_SECRET_ACCESS_KEY,
//     endpoint: process.env.YANDEX_CLOUD_ENDPOINT,
//     signatureVersion: 'v4',
//     region: process.env.YANDEX_CLOUD_REGION,
// });
//
// export async function uploadToYandexCloud(file: Express.Multer.File): Promise<string> {
//     const params = {
//         Bucket: process.env.YANDEX_CLOUD_BUCKET_NAME,
//         Key: `user-photos/${file.originalname}`,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//         ACL: 'public-read',
//     };
//
//     const response = await s3.upload(params).promise();
//     return response.Location;
// }
