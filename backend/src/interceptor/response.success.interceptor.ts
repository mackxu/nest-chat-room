import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';

interface Response<T> {
  code: number;
  message: string;
  data: T;
}

@Injectable()
export class ResponseSuccessInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        code: 0,
        message: 'success',
        data,
      })),
      catchError((error) => {
        // 自定义错误处理逻辑
        const errorMessage = error.message || 'Internal Server Error';
        const statusCode =
          error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        const errorResponse = {
          code: statusCode,
          message: errorMessage,
          data: null,
        };
        return throwError(() => new HttpException(errorResponse, statusCode));
      }),
    );
  }
}
