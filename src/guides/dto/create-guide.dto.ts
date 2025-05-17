import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { GuideDifficulty } from '../enums/guide-difficulty.enum';
import { GuideStatus } from '../enums/guide-status.enum';
import { Languages } from '../../common/enums/language.enum';

export class CreateGuideDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ enum: GuideDifficulty })
  @IsEnum(GuideDifficulty)
  difficulty!: GuideDifficulty;

  @ApiProperty()
  @IsInt()
  estimatedDuration!: number;

  @ApiProperty({ enum: GuideStatus })
  @IsEnum(GuideStatus)
  status!: GuideStatus;

  @ApiProperty({ enum: Languages })
  @IsEnum(Languages)
  language!: Languages;

  @ApiProperty()
  @IsInt()
  points!: number;
}