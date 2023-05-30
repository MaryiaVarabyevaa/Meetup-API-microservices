import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMeetupDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly topic: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly time: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly date: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly country: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly street: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly houseNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  readonly tags: string[];
}
