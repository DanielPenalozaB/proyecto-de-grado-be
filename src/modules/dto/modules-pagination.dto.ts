import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { BasePaginationDto } from '../../common/dto/base-pagination.dto';
import { ModuleStatus } from '../enums/module-status.enum';

export type ModuleSortableFields = 'id' | 'name' | 'order' | 'points' | 'createdAt' | 'updatedAt';

export class ModulesPaginationDto extends BasePaginationDto {
  @ApiProperty({
    required: false,
    description: 'Field to sort by',
    enum: ['id', 'name', 'order', 'points', 'createdAt', 'updatedAt']
  })
  @IsString()
  @IsOptional()
  sortBy?: ModuleSortableFields;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ enum: ModuleStatus, required: false })
  @IsEnum(ModuleStatus)
  @IsOptional()
  status?: ModuleStatus;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  guideId?: number;

  @ApiProperty({
    required: false,
    description: 'Minimum points'
  })
  @IsInt()
  @IsOptional()
  minPoints?: number;

  @ApiProperty({
    required: false,
    description: 'Maximum points'
  })
  @IsInt()
  @IsOptional()
  maxPoints?: number;
}