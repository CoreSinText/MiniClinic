import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../interfaces/response';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        let message = 'Internal server error';
        let error: any = null;

        if (exception instanceof HttpException) {
            const res = exception.getResponse();
            // Handle NestJS standard error structure
            if (typeof res === 'object' && res !== null && 'message' in res) {
                message = (res as any).message;
                if (Array.isArray(message)) {
                    message = message[0]; // Take first error if array
                }
            } else if (typeof res === 'string') {
                message = res;
            }
            error = res;
        } else if (exception instanceof Error) {
            message = exception.message;
            error = exception.stack;
        }

        const apiResponse: ApiResponse = {
            success: false,
            message: String(message),
            error,
        };

        response.status(status).json(apiResponse);
    }
}
