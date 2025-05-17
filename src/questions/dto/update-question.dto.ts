import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import { BlockType } from '../enums/block-type.enum';
import { DynamicType } from '../enums/dynamic-type.enum';
import { QuestionType } from '../enums/question-type.enum';

export class UpdateQuestionDto {
  @ApiProperty({ enum: BlockType, required: false })
  @IsEnum(BlockType)
  @IsOptional()
  blockType?: BlockType;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  statement?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  resourceUrl?: string;

  @ApiProperty({ enum: DynamicType, required: false })
  @IsEnum(DynamicType)
  @IsOptional()
  dynamicType?: DynamicType;

  @ApiProperty({ enum: QuestionType, required: false })
  @IsEnum(QuestionType)
  @IsOptional()
  questionType?: QuestionType;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  feedback?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  moduleId?: number;
}