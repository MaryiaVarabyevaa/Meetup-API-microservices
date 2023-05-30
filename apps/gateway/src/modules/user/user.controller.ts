import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { YandexCloudService } from '@app/common';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly yandexCloudService: YandexCloudService,
  ) {}

  @Patch(':id/role')
  @HttpCode(HttpStatus.NO_CONTENT)
  async changeUserRole(@Param('id') id: number): Promise<void> {
    await this.userService.changeUserRole(id);
  }

  @Post(':id/upload-avatar')
  @UseInterceptors(FileInterceptor('photo'))
  async uploadAvatar(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    const { buffer, originalname, mimetype } = file;
    const imageUrl = await this.yandexCloudService.uploadFile(
      buffer,
      originalname,
      mimetype,
    );
    await this.userService.uploadAvatar(id, imageUrl);
    return imageUrl;
  }
}
