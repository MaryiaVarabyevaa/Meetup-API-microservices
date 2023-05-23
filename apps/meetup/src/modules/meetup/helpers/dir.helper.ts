import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DirHelper {
  checkDir(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    return dir;
  }
}
