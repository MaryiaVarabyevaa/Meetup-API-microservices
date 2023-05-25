import { CreateUserDto, LoginUserDto } from '../dtos';

export type Data =
  | CreateUserDto
  | LoginUserDto
  | { userId: number }
  | { userId: number; refreshToken: string };
