import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { DomainError } from '@/domain/shared';
import { Response } from 'express';
import { UserAlreadyExistsError, UserNotFoundError } from '@/domain/user';
import {
  EmailAlreadyInUseError,
  InactiveUserError,
  InvalidCredentialsError,
  InvalidRefreshTokenError,
} from '@/domain/auth';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = this.resolveStatus(exception);

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
    });
  }

  private resolveStatus(exception: DomainError): number {
    if (exception instanceof UserNotFoundError) {
      return HttpStatus.NOT_FOUND;
    }

    if (
      exception instanceof EmailAlreadyInUseError ||
      exception instanceof UserAlreadyExistsError
    ) {
      return HttpStatus.CONFLICT;
    }

    if (
      exception instanceof InvalidCredentialsError ||
      exception instanceof InvalidRefreshTokenError
    ) {
      return HttpStatus.UNAUTHORIZED;
    }

    if (exception instanceof InactiveUserError) {
      return HttpStatus.FORBIDDEN;
    }

    return HttpStatus.UNPROCESSABLE_ENTITY;
  }
}
