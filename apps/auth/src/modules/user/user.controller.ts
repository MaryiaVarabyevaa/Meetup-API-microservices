import { Controller } from '@nestjs/common';
import { UserService } from './user.service';

// import {uploadToYandexCloud} from "./ yandex-cloud.service";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
