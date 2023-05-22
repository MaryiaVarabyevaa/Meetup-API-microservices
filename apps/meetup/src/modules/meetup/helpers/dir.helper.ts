import * as fs from "fs";
import {Injectable} from "@nestjs/common";


@Injectable()
export class CheckDir {
    checkDir(dir: string) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        return dir;
    }
}