import { Request, Response } from 'express';
import { AppDataSource } from '../config/typeorm.config';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Brackets } from 'typeorm';
import { PaginationService } from '../common/services/pagination.service';
import { QuestionsPaginationDto } from './dto/questions-pagination.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionResponseDto } from './dto/question-response.dto';
import { Question } from './entities/questions.entity';
import { Module } from '../modules/entities/modules.entity';

const questionRepository = AppDataSource.getRepository(Question);
const moduleRepository = AppDataSource.getRepository(Module);
const paginationService = new PaginationService<Question>();

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const pagination = plainToClass(QuestionsPaginationDto, req.query);
    const errors = await validate(pagination);

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const queryBuilder = questionRepository.createQueryBuilder('question')
      .leftJoinAndSelect('question.module', 'module');

    if (pagination.search) {
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where('LOWER(question.statement) LIKE LOWER(:search)', { search: `%${pagination.search}%` })
            .orWhere('LOWER(question.description) LIKE LOWER(:search)', { search: `%${pagination.search}%` })
            .orWhere('LOWER(question.feedback) LIKE LOWER(:search)', { search: `%${pagination.search}%` });
        })
      );
    }

    if (pagination.blockType) {
      queryBuilder.andWhere('question.blockType = :blockType', { blockType: pagination.blockType });
    }

    if (pagination.dynamicType) {
      queryBuilder.andWhere('question.dynamicType = :dynamicType', { dynamicType: pagination.dynamicType });
    }

    if (pagination.questionType) {
      queryBuilder.andWhere('question.questionType = :questionType', { questionType: pagination.questionType });
    }

    if (pagination.moduleId) {
      queryBuilder.andWhere('question.moduleId = :moduleId', { moduleId: pagination.moduleId });
    }

    const [data, total] = await queryBuilder
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit)
      .getManyAndCount();

    const responseData = data.map(question => new QuestionResponseDto(question));

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
    res.status(500).json({ message: 'Error fetching questions', error });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const question = await questionRepository.findOne({
      where: { id: Number(id) },
      relations: ['module']
    });

    if (!question) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    res.status(200).json({ data: new QuestionResponseDto(question) });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching question', error });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const createQuestionDto = plainToClass(CreateQuestionDto, req.body);
    const errors = await validate(createQuestionDto);

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const module = await moduleRepository.findOneBy({ id: createQuestionDto.moduleId });
    if (!module) {
      res.status(404).json({ message: 'Module not found' });
      return;
    }

    const newQuestion = questionRepository.create({
      ...createQuestionDto,
      module
    });

    const result = await questionRepository.save(newQuestion);

    res.status(201).json({
      message: 'Question created successfully',
      data: new QuestionResponseDto(result)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating question', error });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateQuestionDto = plainToClass(UpdateQuestionDto, req.body);
    const errors = await validate(updateQuestionDto);

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const question = await questionRepository.findOneBy({ id: Number(id) });
    if (!question) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    if (updateQuestionDto.moduleId) {
      const module = await moduleRepository.findOneBy({ id: updateQuestionDto.moduleId });
      if (!module) {
        res.status(404).json({ message: 'Module not found' });
        return;
      }
      question.module = module;
    }

    Object.assign(question, updateQuestionDto);
    const result = await questionRepository.save(question);

    res.status(200).json({
      message: 'Question updated successfully',
      data: new QuestionResponseDto(result)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating question', error });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await questionRepository.softDelete(id);
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting question', error });
  }
};