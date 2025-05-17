import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { BasePaginationDto } from '../../common/dto/base-pagination.dto';
import { GuideDifficulty } from '../enums/guide-difficulty.enum';
import { GuideStatus } from '../enums/guide-status.enum';
import { Languages } from '../../common/enums/language.enum';

export type GuideSortableFields = 'id' | 'name' | 'difficulty' | 'estimatedDuration' | 'points' | 'createdAt' | 'updatedAt';

export class GuidesPaginationDto extends BasePaginationDto {
  @ApiProperty({
    required: false,
    description: 'Field to sort by',
    enum: ['id', 'name', 'difficulty', 'estimatedDuration', 'points', 'createdAt', 'updatedAt']
  })
  @IsString()
  @IsOptional()
  sortBy?: GuideSortableFields;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ enum: GuideDifficulty, required: false })
  @IsEnum(GuideDifficulty)
  @IsOptional()
  difficulty?: GuideDifficulty;

  @ApiProperty({ enum: GuideStatus, required: false })
  @IsEnum(GuideStatus)
  @IsOptional()
  status?: GuideStatus;

  @ApiProperty({ enum: Languages, required: false })
  @IsEnum(Languages)
  @IsOptional()
  language?: Languages;

  @ApiProperty({
    required: false,
    description: 'Minimum estimated duration in minutes'
  })
  @IsInt()
  @IsOptional()
  minDuration?: number;

  @ApiProperty({
    required: false,
    description: 'Maximum estimated duration in minutes'
  })
  @IsInt()
  @IsOptional()
  maxDuration?: number;

  @ApiProperty({
    required: false,
    description: 'Minimum points'
  })
  @IsInt()
  @IsOptional()
  minPoints?: number;

  @ApiProperty({
    required: false,
    description: 'Maximum points'
  })
  @IsInt()
  @IsOptional()
  maxPoints?: number;
}