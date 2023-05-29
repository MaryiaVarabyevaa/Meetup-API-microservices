import { CreateUserDto, LoginUserDto } from '../dtos';

export type Data =
  | CreateUserDto
  | LoginUserDto
  | { id: number }
  | { id: number; refreshToken: string };
