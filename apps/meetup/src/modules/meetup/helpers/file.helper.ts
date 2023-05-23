import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FileHelper {
  async createReadStream(filePath: string): Promise<fs.ReadStream> {
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(filePath);
      readStream
        .on('open', () => {
          resolve(readStream);
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  }
}
