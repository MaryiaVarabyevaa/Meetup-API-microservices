import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TypeParamDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsIn(['pdf', 'csv'])
  readonly type: string;
}
