import { Provider } from '@prisma/client/auth';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    required: false,
  })
  @MinLength(6)
  readonly password?: string;

  @ApiProperty({
    required: false,
    name: 'provider',
    enum: Provider,
  })
  readonly provider?: Provider;
}
