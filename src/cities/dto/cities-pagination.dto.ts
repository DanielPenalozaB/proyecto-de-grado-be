import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BasePaginationDto } from '../../common/dto/base-pagination.dto';

export type CitySortableFields = 'id' | 'name' | 'rainfall' | 'createdAt' | 'updatedAt';

export class CitiesPaginationDto extends BasePaginationDto {
  @ApiProperty({
    required: false,
    description: 'Field to sort by',
    enum: ['id', 'name', 'rainfall', 'createdAt', 'updatedAt']
  })
  @IsString()
  @IsOptional()
  sortBy?: CitySortableFields;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({ required: false, description: 'Search term for multiple fields' })
  @IsString()
  @IsOptional()
  search?: string;
}