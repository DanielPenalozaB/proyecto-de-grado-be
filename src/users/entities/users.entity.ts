import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';import { Roles } from '../enums/roles';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - role
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *         email:
 *           type: string
 *         name:
 *           type: string
 *         role:
 *           type: string
 *           enum: [citizen, moderator, admin]
 *         password:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
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
    example: 'user@admon.uniajc.edu.co',
  })
  @Column({ unique: true })
  email!: string;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  @Column()
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
  @Column()
  password!: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-04-30T12:00:00Z',
  })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-04-30T12:00:00Z',
  })
  @UpdateDateColumn()
  updatedAt!: Date;
}