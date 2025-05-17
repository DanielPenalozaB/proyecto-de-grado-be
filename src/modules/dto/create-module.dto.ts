import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ModuleStatus } from '../enums/module-status.enum';

export class CreateModuleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty()
  @IsInt()
  order!: number;

  @ApiProperty()
  @IsInt()
  points!: number;

  @ApiProperty({ enum: ModuleStatus })
  @IsEnum(ModuleStatus)
  status!: ModuleStatus;

  @ApiProperty()
  @IsInt()
  guideId!: number;
}