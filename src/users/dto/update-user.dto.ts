import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Roles } from '../enums/roles';

export class UpdateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ enum: Roles, example: Roles.Citizen, description: 'User role', required: false })
  @IsEnum(Roles)
  @IsOptional()
  role?: Roles;
}