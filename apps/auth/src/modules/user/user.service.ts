import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client/auth';
import { AuthPrismaClient } from '@app/common';
import { CreateUserDto } from '../auth/dtos';

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

  async addUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.authPrismaClient.user.create({
      data: { ...createUserDto },
    });
    return user;
  }
}
