import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Languages } from '../../common/enums/language.enum';

@Entity('cities')
export class City {
  @ApiProperty({
    description: 'The unique identifier of the city',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({
    description: 'The name of the city',
    example: 'New York',
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;

  @ApiProperty({
    description: 'Description of the city',
    example: 'The most populous city in the United States',
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Rainfall measurement in mm',
    example: 1200,
  })
  @Column({ type: 'float', nullable: true })
  rainfall?: number;

  @ApiProperty({
    description: 'User role (citizen, moderator, admin)',
    example: Languages.ES,
    enum: Languages,
  })
  @Column({
    type: 'enum',
    enum: Languages,
    default: Languages.ES,
  })
  language?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-04-30T12:00:00Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-04-30T12:00:00Z',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ApiProperty({
    description: 'Deletion timestamp',
    example: '2025-04-30T12:00:00Z',
    required: false,
  })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}