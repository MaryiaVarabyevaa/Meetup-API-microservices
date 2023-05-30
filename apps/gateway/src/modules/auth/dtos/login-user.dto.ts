import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto extends OmitType(CreateUserDto, [
  'firstName',
  'lastName',
] as const) {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
