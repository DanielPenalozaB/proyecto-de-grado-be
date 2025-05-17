import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ModuleStatus } from '../enums/module-status.enum';

export class UpdateModuleDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  order?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  points?: number;

  @ApiProperty({ enum: ModuleStatus, required: false })
  @IsEnum(ModuleStatus)
  @IsOptional()
  status?: ModuleStatus;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  guideId?: number;
}