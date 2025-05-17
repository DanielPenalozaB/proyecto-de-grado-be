import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { BlockType } from '../enums/block-type.enum';
import { DynamicType } from '../enums/dynamic-type.enum';
import { QuestionType } from '../enums/question-type.enum';

export class CreateQuestionDto {
  @ApiProperty({ enum: BlockType })
  @IsEnum(BlockType)
  blockType!: BlockType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  statement!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsUrl()
  @IsOptional()
  resourceUrl?: string;

  @ApiProperty({ enum: DynamicType })
  @IsEnum(DynamicType)
  dynamicType!: DynamicType;

  @ApiProperty({ enum: QuestionType })
  @IsEnum(QuestionType)
  questionType!: QuestionType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  feedback!: string;

  @ApiProperty()
  @IsInt()
  moduleId!: number;
}