import { Request, Response } from 'express';
import { AppDataSource } from '../config/typeorm.config';
import { User } from './entities/users.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Brackets, FindOptionsOrder, FindOptionsWhere, Like, MoreThan } from 'typeorm';
import { Roles } from './enums/roles';
import { v4 as uuidv4 } from 'uuid';
import { addHours } from 'date-fns';
import { PaginationService } from '../common/services/pagination.service';
import { UsersPaginationDto } from './dto/users-pagination.dto';

const userRepository = AppDataSource.getRepository(User);
const paginationService = new PaginationService<User>();

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    // Parse and validate pagination
    const pagination = plainToClass(UsersPaginationDto, req.query);
    const errors = await validate(pagination);

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    // Create query builder
    const queryBuilder = userRepository.createQueryBuilder('user');

    // Apply search filter
    if (pagination.search) {
      const searchTerm = `%${pagination.search.toLowerCase()}%`;
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where('LOWER(user.name) LIKE LOWER(:search)', { search: `%${pagination.search}%` })
            .orWhere('LOWER(user.email) LIKE LOWER(:search)', { search: `%${pagination.search}%` });
        })
      );
    } else {
      if (pagination.email) {
        queryBuilder.andWhere('LOWER(user.email) LIKE LOWER(:email)', { email: `%${pagination.email}%` });
      }
      if (pagination.name) {
        queryBuilder.andWhere('LOWER(user.name) LIKE LOWER(:name)', { name: `%${pagination.name}%` });
      }
    }

    // Apply role filter
    if (pagination.role) {
      queryBuilder.andWhere('user.role = :role', { role: pagination.role });
    }

    // Apply sorting
    if (pagination.sortBy) {
      queryBuilder.orderBy(`user.${pagination.sortBy}`, pagination.sortDirection);
    } else {
      queryBuilder.orderBy('user.createdAt', 'ASC');
    }

    // Get paginated results
    const [data, total] = await queryBuilder
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit)
      .getManyAndCount();

    // Transform users to response DTOs
    const responseData = data.map(user => new UserResponseDto(user));

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
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await userRepository.findOneBy({ id: Number(id) });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ data: new UserResponseDto(user) });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const createUserDto = plainToClass(CreateUserDto, req.body);
    const errors = await validate(createUserDto);

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    // Check if email already exists
    const existingUser = await userRepository.findOneBy({ email: createUserDto.email });
    if (existingUser) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }

    // Create user without password
    const newUser = userRepository.create({
      ...createUserDto,
      password: '', // Empty password initially
      passwordSet: false,
      passwordResetToken: uuidv4(),
      passwordResetExpires: addHours(new Date(), 24), // Token valid for 24 hours
    });

    const result = await userRepository.save(newUser);

    // TODO: Send email with password setup link containing the token
    // Example: sendPasswordSetupEmail(result.email, result.passwordResetToken);

    // Return response
    res.status(201).json({
      message: 'User created successfully. Password setup required.',
      data: new UserResponseDto(result)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Add this new endpoint to handle password setup
export const setupPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user by token
    const user = await userRepository.findOneBy({
      passwordResetToken: token,
      passwordResetExpires: MoreThan(new Date())
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired token' });
      return;
    }

    // Update password
    user.password = await hashPassword(password);
    user.passwordSet = true;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await userRepository.save(user);

    res.status(200).json({ message: 'Password set successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error setting password', error });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate input
    const updateUserDto = plainToClass(UpdateUserDto, req.body);
    const errors = await validate(updateUserDto);

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    // Check if user exists
    const user = await userRepository.findOneBy({ id: Number(id) });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if new email is already in use by another user
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExists = await userRepository.findOneBy({ email: updateUserDto.email });
      if (emailExists) {
        res.status(400).json({ message: 'Email already in use by another user' });
        return;
      }
    }

    // Update user
    await userRepository.update(id, updateUserDto);
    const updatedUser = await userRepository.findOneBy({ id: Number(id) });

    res.status(200).json({
      message: 'User updated successfully',
      data: new UserResponseDto(updatedUser!)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await userRepository.findOneBy({ id: Number(id) });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Soft delete (if your entity supports it)
    await userRepository.softDelete(id);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}