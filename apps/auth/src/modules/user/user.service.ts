import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client/auth';
import { AuthPrismaClient } from '@app/common';
import { CreateUser } from '../auth/types';

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
  //
  // async changeUserRole(id: number) {
  //   const isExistedUser = await this.findUserById(id);
  //   if (!isExistedUser) {
  //     throw new UnauthorizedException();
  //   }
  //
  //   const { role } = isExistedUser;
  //   const newRole = UserRole.USER === role ? UserRole.ORGANIZER : UserRole.USER;
  //   const user = await this.authPrismaClient.user.update({
  //     where: { id },
  //     data: { role: newRole },
  //   });
  //
  //   return user;
  // }
  //
  // async uploadAvatar(id: number, avatarPath: string) {
  //   return this.authPrismaClient.user.update({
  //     where: { id },
  //     data: { avatar: avatarPath },
  //   });
  // }
}
