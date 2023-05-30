import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OmitType } from '@nestjs/mapped-types';
import { CreateMeetupDto } from './create-meetup.dto';

export class UpdateMeetupDto extends OmitType(CreateMeetupDto, [] as const) {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;

  @ApiProperty()
  readonly topic: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  readonly time: string;

  @ApiProperty()
  readonly date: string;

  @ApiProperty()
  readonly country: string;

  @ApiProperty()
  readonly city: string;

  @ApiProperty()
  readonly street: string;

  @ApiProperty()
  readonly houseNumber: string;

  @ApiProperty()
  readonly tags: string[];
}
