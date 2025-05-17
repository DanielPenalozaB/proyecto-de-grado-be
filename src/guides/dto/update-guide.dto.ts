import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { GuideDifficulty } from '../enums/guide-difficulty.enum';
import { GuideStatus } from '../enums/guide-status.enum';
import { Languages } from '../../common/enums/language.enum';

export class UpdateGuideDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: GuideDifficulty, required: false })
  @IsEnum(GuideDifficulty)
  @IsOptional()
  difficulty?: GuideDifficulty;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  estimatedDuration?: number;

  @ApiProperty({ enum: GuideStatus, required: false })
  @IsEnum(GuideStatus)
  @IsOptional()
  status?: GuideStatus;

  @ApiProperty({ enum: Languages, required: false })
  @IsEnum(Languages)
  @IsOptional()
  language?: Languages;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  points?: number;
}