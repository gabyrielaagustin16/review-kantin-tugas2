import type { Request, Response, NextFunction } from 'express';
import { ZodError, type ZodTypeAny } from 'zod';
import { ValidationError, type FieldError } from '../errors/ValidationError';

export function validate(schema: ZodTypeAny) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as { body?: unknown; query?: unknown; params?: unknown };

      if (parsed.body !== undefined) req.body = parsed.body;
      if (parsed.query !== undefined) req.query = parsed.query as typeof req.query;
      if (parsed.params !== undefined) req.params = parsed.params as typeof req.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: FieldError[] = error.issues.map((issue) => {
          const field = issue.path.length > 1
            ? issue.path.slice(1).join('.')
            : String(issue.path[0] ?? 'unknown');
          return {
            field,
            message: issue.message,
          };
        });
        return next(new ValidationError(formattedErrors));
      }
      next(error);
    }
  };
}