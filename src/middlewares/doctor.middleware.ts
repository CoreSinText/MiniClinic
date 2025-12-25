import { Injectable } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class DoctorMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    next();
  }
}
