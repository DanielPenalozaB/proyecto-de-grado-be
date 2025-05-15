import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { Brackets } from 'typeorm';
import { AppDataSource } from '../config/typeorm.config';
import { CitiesPaginationDto } from './dto/cities-pagination.dto';
import { CityResponseDto } from './dto/city-response.dto';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/cities.entity';

const cityRepository = AppDataSource.getRepository(City);

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const pagination = plainToClass(CitiesPaginationDto, req.query);
    const errors = await validate(pagination);

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const queryBuilder = cityRepository.createQueryBuilder('city');

    if (pagination.search) {
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where('LOWER(city.name) LIKE LOWER(:search)', { search: `%${pagination.search}%` })
            .orWhere('LOWER(city.description) LIKE LOWER(:search)', { search: `%${pagination.search}%` });
        })
      );
    } else {
      if (pagination.name) {
        queryBuilder.andWhere('LOWER(city.name) LIKE LOWER(:name)', { name: `%${pagination.name}%` });
      }
      if (pagination.language) {
        queryBuilder.andWhere('city.language = :language', { language: pagination.language });
      }
    }

    if (pagination.sortBy) {
      queryBuilder.orderBy(`city.${pagination.sortBy}`, pagination.sortDirection);
    } else {
      queryBuilder.orderBy('city.createdAt', 'ASC');
    }

    const [data, total] = await queryBuilder
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit)
      .getManyAndCount();

    const responseData = data.map(city => new CityResponseDto(city));

    res.status(200).json({
      data: responseData,
      meta: {
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          pageCount: Math.ceil(total / pagination.limit),
          total,
          hasNextPage: pagination.page * pagination.limit < total,
          hasPreviousPage: pagination.page > 1,
        },
        sort: {
          by: pagination.sortBy || 'createdAt',
          direction: pagination.sortDirection,
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cities', error });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const city = await cityRepository.findOneBy({ id: Number(id) });

    if (!city) {
      res.status(404).json({ message: 'City not found' });
      return;
    }

    res.status(200).json({ data: new CityResponseDto(city) });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching city', error });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const createCityDto = plainToClass(CreateCityDto, req.body);
    const errors = await validate(createCityDto);

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    // Check if city already exists
    const existingCity = await cityRepository.findOneBy({ name: createCityDto.name });
    if (existingCity) {
      res.status(400).json({ message: 'City with this name already exists' });
      return;
    }

    // Create city
    const newCity = cityRepository.create(createCityDto);
    const result = await cityRepository.save(newCity);

    res.status(201).json({
      message: 'City created successfully',
      data: new CityResponseDto(result)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating city', error });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate input
    const updateCityDto = plainToClass(UpdateCityDto, req.body);
    const errors = await validate(updateCityDto);

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    // Check if city exists
    const city = await cityRepository.findOneBy({ id: Number(id) });
    if (!city) {
      res.status(404).json({ message: 'City not found' });
      return;
    }

    // Check if new name is already in use by another city
    if (updateCityDto.name && updateCityDto.name !== city.name) {
      const nameExists = await cityRepository.findOneBy({ name: updateCityDto.name });
      if (nameExists) {
        res.status(400).json({ message: 'City with this name already exists' });
        return;
      }
    }

    // Update city
    await cityRepository.update(id, updateCityDto);
    const updatedCity = await cityRepository.findOneBy({ id: Number(id) });

    res.status(200).json({
      message: 'City updated successfully',
      data: new CityResponseDto(updatedCity!)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating city', error });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const city = await cityRepository.findOneBy({ id: Number(id) });

    if (!city) {
      res.status(404).json({ message: 'City not found' });
      return;
    }

    // Soft delete
    await cityRepository.softDelete(id);

    res.status(200).json({ message: 'City deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting city', error });
  }
};