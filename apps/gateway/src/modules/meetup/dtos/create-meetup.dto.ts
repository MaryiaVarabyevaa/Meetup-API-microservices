import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateMeetupDto {
  @IsNotEmpty()
  @IsString()
  readonly topic: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  readonly time: string;

  @IsNotEmpty()
  @IsString()
  readonly date: string;

  @IsNotEmpty()
  @IsString()
  readonly country: string;

  @IsNotEmpty()
  @IsString()
  readonly city: string;

  @IsNotEmpty()
  @IsString()
  readonly street: string;

  @IsNotEmpty()
  @IsString()
  readonly houseNumber: string;

  @IsNotEmpty()
  @IsArray()
  readonly tags: string[];
}
