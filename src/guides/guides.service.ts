import { Request, Response } from 'express';
import { AppDataSource } from '../config/typeorm.config';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Brackets } from 'typeorm';
import { PaginationService } from '../common/services/pagination.service';
import { CreateGuideDto } from './dto/create-guide.dto';
import { UpdateGuideDto } from './dto/update-guide.dto';
import { GuideResponseDto } from './dto/guide-response.dto';
import { Guide } from './entities/guides.entity';
import { GuidesPaginationDto } from './dto/guides-pagination.dto';

const guideRepository = AppDataSource.getRepository(Guide);
const paginationService = new PaginationService<Guide>();

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const pagination = plainToClass(GuidesPaginationDto, req.query);
    const errors = await validate(pagination);

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const queryBuilder = guideRepository.createQueryBuilder('guide')
      .leftJoinAndSelect('guide.modules', 'modules');

    if (pagination.search) {
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where('LOWER(guide.name) LIKE LOWER(:search)', { search: `%${pagination.search}%` })
            .orWhere('LOWER(guide.description) LIKE LOWER(:search)', { search: `%${pagination.search}%` });
        })
      );
    }

    if (pagination.difficulty) {
      queryBuilder.andWhere('guide.difficulty = :difficulty', { difficulty: pagination.difficulty });
    }

    if (pagination.status) {
      queryBuilder.andWhere('guide.status = :status', { status: pagination.status });
    }

    if (pagination.language) {
      queryBuilder.andWhere('guide.language = :language', { language: pagination.language });
    }

    const [data, total] = await queryBuilder
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit)
      .getManyAndCount();

    const responseData = data.map(guide => new GuideResponseDto(guide));

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
    res.status(500).json({ message: 'Error fetching guides', error });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const guide = await guideRepository.findOne({
      where: { id: Number(id) },
      relations: ['modules', 'modules.questions']
    });

    if (!guide) {
      res.status(404).json({ message: 'Guide not found' });
      return;
    }

    res.status(200).json({ data: new GuideResponseDto(guide) });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching guide', error });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const createGuideDto = plainToClass(CreateGuideDto, req.body);
    const errors = await validate(createGuideDto);

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const newGuide = guideRepository.create(createGuideDto);
    const result = await guideRepository.save(newGuide);

    res.status(201).json({
      message: 'Guide created successfully',
      data: new GuideResponseDto(result)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating guide', error });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateGuideDto = plainToClass(UpdateGuideDto, req.body);
    const errors = await validate(updateGuideDto);

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    await guideRepository.update(id, updateGuideDto);
    const updatedGuide = await guideRepository.findOneBy({ id: Number(id) });

    res.status(200).json({
      message: 'Guide updated successfully',
      data: new GuideResponseDto(updatedGuide!)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating guide', error });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await guideRepository.softDelete(id);
    res.status(200).json({ message: 'Guide deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting guide', error });
  }
};