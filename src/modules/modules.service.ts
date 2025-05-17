import { Request, Response } from 'express';
import { AppDataSource } from '../config/typeorm.config';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Brackets } from 'typeorm';
import { PaginationService } from '../common/services/pagination.service';
import { ModulesPaginationDto } from './dto/modules-pagination.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ModuleResponseDto } from './dto/module-response.dto';
import { Module } from './entities/modules.entity';
import { Guide } from '../guides/entities/guides.entity';

const moduleRepository = AppDataSource.getRepository(Module);
const guideRepository = AppDataSource.getRepository(Guide);
const paginationService = new PaginationService<Module>();

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const pagination = plainToClass(ModulesPaginationDto, req.query);
    const errors = await validate(pagination);

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const queryBuilder = moduleRepository.createQueryBuilder('module')
      .leftJoinAndSelect('module.guide', 'guide');

    if (pagination.search) {
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where('LOWER(module.name) LIKE LOWER(:search)', { search: `%${pagination.search}%` })
            .orWhere('LOWER(module.description) LIKE LOWER(:search)', { search: `%${pagination.search}%` });
        })
      );
    }

    if (pagination.status) {
      queryBuilder.andWhere('module.status = :status', { status: pagination.status });
    }

    if (pagination.guideId) {
      queryBuilder.andWhere('module.guideId = :guideId', { guideId: pagination.guideId });
    }

    if (pagination.minPoints !== undefined) {
      queryBuilder.andWhere('module.points >= :minPoints', { minPoints: pagination.minPoints });
    }

    if (pagination.maxPoints !== undefined) {
      queryBuilder.andWhere('module.points <= :maxPoints', { maxPoints: pagination.maxPoints });
    }

    const [data, total] = await queryBuilder
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit)
      .getManyAndCount();

    const responseData = data.map(module => new ModuleResponseDto(module));

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
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching modules', error });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const module = await moduleRepository.findOne({
      where: { id: Number(id) },
      relations: ['guide', 'questions']
    });

    if (!module) {
      res.status(404).json({ message: 'Module not found' });
      return;
    }

    res.status(200).json({ data: new ModuleResponseDto(module) });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching module', error });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const createModuleDto = plainToClass(CreateModuleDto, req.body);
    const errors = await validate(createModuleDto);

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const guide = await guideRepository.findOneBy({ id: createModuleDto.guideId });
    if (!guide) {
      res.status(404).json({ message: 'Guide not found' });
      return;
    }

    const newModule = moduleRepository.create({
      ...createModuleDto,
      guide
    });

    const result = await moduleRepository.save(newModule);

    res.status(201).json({
      message: 'Module created successfully',
      data: new ModuleResponseDto(result)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating module', error });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateModuleDto = plainToClass(UpdateModuleDto, req.body);
    const errors = await validate(updateModuleDto);

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const module = await moduleRepository.findOneBy({ id: Number(id) });
    if (!module) {
      res.status(404).json({ message: 'Module not found' });
      return;
    }

    if (updateModuleDto.guideId) {
      const guide = await guideRepository.findOneBy({ id: updateModuleDto.guideId });
      if (!guide) {
        res.status(404).json({ message: 'Guide not found' });
        return;
      }
      module.guide = guide;
    }

    Object.assign(module, updateModuleDto);
    const result = await moduleRepository.save(module);

    res.status(200).json({
      message: 'Module updated successfully',
      data: new ModuleResponseDto(result)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating module', error });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await moduleRepository.softDelete(id);
    res.status(200).json({ message: 'Module deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting module', error });
  }
};