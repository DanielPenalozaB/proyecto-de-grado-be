import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { QuestionType } from '../enums/question-type.enum';
import { DynamicType } from '../enums/dynamic-type.enum';
import { BlockType } from '../enums/block-type.enum';
import { Module } from '../../modules/entities/modules.entity';

@Entity('questions')
export class Question {
  @ApiProperty({ description: 'The unique identifier of the question' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ enum: BlockType, description: 'The content block type for presenting the question' })
  @Column({ type: 'enum', enum: BlockType })
  blockType!: BlockType;

  @ApiProperty({ description: 'The main question text or statement' })
  @Column({ type: 'text' })
  statement!: string;

  @ApiProperty({ description: 'Additional explanation or context for the question', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'URL to a related resource (image, video, etc.)', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  resourceUrl?: string;

  @ApiProperty({ enum: DynamicType, description: 'Whether the question is static or dynamically generated' })
  @Column({ type: 'enum', enum: DynamicType })
  dynamicType!: DynamicType;

  @ApiProperty({ enum: QuestionType, description: 'The format/type of the question (multiple choice, etc.)' })
  @Column({ type: 'enum', enum: QuestionType })
  questionType!: QuestionType;

  @ApiProperty({ description: 'Feedback provided to the user after answering' })
  @Column({ type: 'text' })
  feedback!: string;

  @ApiProperty({ type: () => Module, description: 'The parent module this question belongs to' })
  @ManyToOne(() => Module, module => module.questions)
  module!: Module;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ApiProperty({ description: 'Deletion timestamp', required: false })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}