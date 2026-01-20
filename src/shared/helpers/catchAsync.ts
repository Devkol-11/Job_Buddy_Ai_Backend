import { RequestHandler } from 'express';
import { Request, Response, NextFunction } from 'express';

export function protectHandler(requestHandler: RequestHandler) {
        return (req: Request, res: Response, next: NextFunction) => {
                Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
        };
}
