import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Question } from '../entities/questions.entity';

export class QuestionResponseDto {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty()
  @Expose()
  blockType!: string;

  @ApiProperty()
  @Expose()
  statement!: string;

  @ApiProperty()
  @Expose()
  description?: string;

  @ApiProperty()
  @Expose()
  resourceUrl?: string;

  @ApiProperty()
  @Expose()
  dynamicType!: string;

  @ApiProperty()
  @Expose()
  questionType!: string;

  @ApiProperty()
  @Expose()
  feedback!: string;

  @ApiProperty()
  @Expose()
  moduleId!: number;

  @ApiProperty()
  @Expose()
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  updatedAt!: Date;

  constructor(partial: Partial<Question>) {
    Object.assign(this, partial);
    this.moduleId = partial.module?.id || 0;
  }
}