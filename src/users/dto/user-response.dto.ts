import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Roles } from '../enums/roles';
import { User } from '../entities/users.entity';

export class UserResponseDto {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty()
  @Expose()
  email!: string;

  @ApiProperty()
  @Expose()
  name!: string;

  @ApiProperty({ enum: Roles })
  @Expose()
  role!: Roles;

  @ApiProperty()
  @Expose()
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  updatedAt!: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}