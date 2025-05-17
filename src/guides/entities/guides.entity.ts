import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { GuideDifficulty } from '../enums/guide-difficulty.enum';
import { Languages } from '../../common/enums/language.enum';
import { GuideStatus } from '../enums/guide-status.enum';
import { Module } from '../../modules/entities/modules.entity';

@Entity('guides')
export class Guide {
  @ApiProperty({ description: 'The unique identifier of the guide' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: 'Name of the guide' })
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @ApiProperty({ description: 'Description of the guide' })
  @Column({ type: 'text' })
  description!: string;

  @ApiProperty({ enum: GuideDifficulty, description: 'Difficulty level of the guide' })
  @Column({ type: 'enum', enum: GuideDifficulty })
  difficulty!: GuideDifficulty;

  @ApiProperty({ description: 'Estimated duration in minutes' })
  @Column({ type: 'int' })
  estimatedDuration!: number;

  @ApiProperty({ enum: GuideStatus, description: 'Publication status of the guide' })
  @Column({ type: 'enum', enum: GuideStatus, default: GuideStatus.DRAFT })
  status!: GuideStatus;

  @ApiProperty({ enum: Languages, description: 'Language of the guide' })
  @Column({ type: 'enum', enum: Languages })
  language!: Languages;

  @ApiProperty({ description: 'Points awarded for completing the guide' })
  @Column({ type: 'int' })
  points!: number;

  @ApiProperty({ type: () => [Module], description: 'Modules belonging to this guide' })
  @OneToMany(() => Module, module => module.guide)
  modules!: Module[];

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