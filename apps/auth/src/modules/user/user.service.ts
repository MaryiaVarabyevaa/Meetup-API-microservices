import { Inject, Injectable } from '@nestjs/common';
import {User, UserRole} from '@prisma/client/auth';
import { AuthPrismaClient } from '@app/common';
import { CreateUser } from '../auth/types';
import {UploadAvatar} from "./types";

@Injectable()
export class UserService {
  constructor(
    @Inject('AUTH_PRISMA') private readonly authPrismaClient: AuthPrismaClient,
  ) {}

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.authPrismaClient.user.findUnique({ where: { email } });
  }

  async findUserById(id: number): Promise<User | undefined> {
    return this.authPrismaClient.user.findUnique({ where: { id } });
  }

  async addUser(createUserDto: CreateUser): Promise<User> {
    const user = await this.authPrismaClient.user.create({
      data: { ...createUserDto },
    });
    return user;
  }

  async changeUserRole(id: number): Promise<void> {
    const isExistedUser = await this.findUserById(id);
    if (!isExistedUser) {
      // throw new UnauthorizedException();
    }

    const { role } = isExistedUser;
    const newRole = UserRole.USER === role ? UserRole.ORGANIZER : UserRole.USER;
    const user = await this.authPrismaClient.user.update({
      where: { id },
      data: { role: newRole },
    });
  }

  async uploadAvatar({ id, link }: UploadAvatar): Promise<void> {
    await this.authPrismaClient.user.update({
      where: { id },
      data: { avatar: link }
    });
  }
}
