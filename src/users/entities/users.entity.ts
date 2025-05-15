import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Roles } from '../enums/roles';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @ApiProperty({
    description: 'User role (citizen, moderator, admin)',
    example: Roles.Citizen,
    enum: Roles,
  })
  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.Citizen,
  })
  role!: Roles;

  @Exclude()
  @Column({ type: 'varchar', length: 255, nullable: true })
  password?: string;

  @Column({ type: 'boolean', default: false })
  passwordSet!: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'password_reset_token'
  })
  passwordResetToken?: string;

  @Column({
    type: 'timestamptz',
    nullable: true,
    name: 'password_reset_expires'
  })
  passwordResetExpires?: Date;

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