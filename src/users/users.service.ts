import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from './entities/users.entity';

const userRepository = AppDataSource.getRepository(User);

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const examples = await userRepository.find();
    res.status(200).json({ data: examples });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching examples', error });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const example = await userRepository.findOneBy({ id: Number(id) });

    if (!example) {
      res.status(404).json({ message: 'Example not found' });
      return;
    }

    res.status(200).json({ data: example });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching example', error });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, role, password } = req.body;
    const newExample = userRepository.create({
      name,
      email,
      role,
      password
    });

    const result = await userRepository.save(newExample);
    res.status(201).json({
      message: 'Example created successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating example', error });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const example = await userRepository.findOneBy({ id: Number(id) });

    if (!example) {
      res.status(404).json({ message: 'Example not found' });
      return;
    }

    await userRepository.update(id, { name, email, role });

    const updatedExample = await userRepository.findOneBy({ id: Number(id) });
    res.status(200).json({
      message: 'Example updated successfully',
      data: updatedExample
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating example', error });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const example = await userRepository.findOneBy({ id: Number(id) });

    if (!example) {
      res.status(404).json({ message: 'Example not found' });
      return;
    }

    await userRepository.delete(id);
    res.status(200).json({ message: 'Example deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting example', error });
  }
};