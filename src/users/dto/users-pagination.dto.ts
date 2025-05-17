import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BasePaginationDto } from '../../common/dto/base-pagination.dto';
import { Roles } from '../enums/roles';

export type UserSortableFields = 'id' | 'name' | 'email' | 'role' | 'createdAt' | 'updatedAt';

export class UsersPaginationDto extends BasePaginationDto {
  @ApiProperty({
    required: false,
    description: 'Field to sort by',
    enum: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt']
  })
  @IsString()
  @IsOptional()
  sortBy?: UserSortableFields;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ enum: Roles, required: false })
  @IsOptional()
  role?: Roles;

  @ApiProperty({ required: false, description: 'Search term for multiple fields' })
  @IsString()
  @IsOptional()
  search?: string;
}