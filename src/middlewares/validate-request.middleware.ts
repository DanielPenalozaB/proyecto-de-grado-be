import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';

export function validateRequest<T extends object>(type: ClassConstructor<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const input = plainToClass(type, req.body);
    const errors = await validate(input, {
      skipMissingProperties: false,
      whitelist: true,
      forbidNonWhitelisted: true
    });

    if (errors.length > 0) {
      const message = errors.map(error => {
        return {
          property: error.property,
          constraints: error.constraints
        };
      });
      res.status(400).json({ errors: message });
      return;
    }

    req.body = input;
    next();
  };
}