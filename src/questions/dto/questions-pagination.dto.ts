import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { BasePaginationDto } from '../../common/dto/base-pagination.dto';
import { BlockType } from '../enums/block-type.enum';
import { DynamicType } from '../enums/dynamic-type.enum';
import { QuestionType } from '../enums/question-type.enum';

export type QuestionSortableFields = 'id' | 'createdAt' | 'updatedAt';

export class QuestionsPaginationDto extends BasePaginationDto {
  @ApiProperty({
    required: false,
    description: 'Field to sort by',
    enum: ['id', 'createdAt', 'updatedAt']
  })
  @IsString()
  @IsOptional()
  sortBy?: QuestionSortableFields;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ enum: BlockType, required: false })
  @IsEnum(BlockType)
  @IsOptional()
  blockType?: BlockType;

  @ApiProperty({ enum: DynamicType, required: false })
  @IsEnum(DynamicType)
  @IsOptional()
  dynamicType?: DynamicType;

  @ApiProperty({ enum: QuestionType, required: false })
  @IsEnum(QuestionType)
  @IsOptional()
  questionType?: QuestionType;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  moduleId?: number;
}