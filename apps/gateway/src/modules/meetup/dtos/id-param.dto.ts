import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IdParamDto {
  @ApiProperty()
  // @IsNumber()
  readonly id: number;
}
