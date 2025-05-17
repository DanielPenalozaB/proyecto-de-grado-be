import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ModuleStatus } from '../enums/module-status.enum';
import { Guide } from '../../guides/entities/guides.entity';
import { Question } from '../../questions/entities/questions.entity';

@Entity('modules')
export class Module {
  @ApiProperty({ description: 'The unique identifier of the module' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: 'Name of the module' })
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @ApiProperty({ description: 'Detailed description of the module content' })
  @Column({ type: 'text' })
  description!: string;

  @ApiProperty({ description: 'Display order within the parent guide' })
  @Column({ type: 'int' })
  order!: number;

  @ApiProperty({ description: 'Points awarded for completing the module' })
  @Column({ type: 'int' })
  points!: number;

  @ApiProperty({ enum: ModuleStatus, description: 'Publication status of the module' })
  @Column({ type: 'enum', enum: ModuleStatus, default: ModuleStatus.DRAFT })
  status!: ModuleStatus;

  @ApiProperty({ type: () => Guide, description: 'The parent guide this module belongs to' })
  @ManyToOne(() => Guide, guide => guide.modules)
  guide!: Guide;

  @ApiProperty({ type: () => [Question], description: 'Questions contained in this module' })
  @OneToMany(() => Question, question => question.module)
  questions!: Question[];

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