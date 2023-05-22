import {Controller, HttpCode, HttpStatus, Param, Patch, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {UserService} from "./user.service";
import {FileInterceptor} from "@nestjs/platform-express";
// import {uploadToYandexCloud} from "./ yandex-cloud.service";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Patch(':id/role')
    @HttpCode(HttpStatus.NO_CONTENT)
    changeUserRole() {
        this.userService.changeUserRole(2);
    }

    @Post(':id')
    @UseInterceptors(FileInterceptor('photo'))
    async uploadAvatar(@Param('id') idd: number, @UploadedFile() file: Express.Multer.File) {
        // const photoUrl = await uploadToYandexCloud(file);

    }
}
