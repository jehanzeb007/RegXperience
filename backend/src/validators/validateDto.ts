import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

export const validateBody =
  (DtoClass: any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(DtoClass, req.body);

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const firstError = errors[0];

      if (firstError.constraints) {
        const message = Object.values(firstError.constraints)[0];

        return res.status(400).json({
          success: false,
          message,
        });
      }
    }

    req.body = dto;
    next();
  };
