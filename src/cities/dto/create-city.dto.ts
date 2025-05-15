import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCityDto {
  @ApiProperty({ example: 'New York', description: 'City name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'The most populous city in the United States',
    description: 'City description',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 1200,
    description: 'Rainfall in mm',
    required: false
  })
  @IsNumber()
  @IsOptional()
  rainfall?: number;

  @ApiProperty({
    example: 'English',
    description: 'Primary language',
    required: false
  })
  @IsString()
  @IsOptional()
  language?: string;
}