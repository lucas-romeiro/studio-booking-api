import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { DomainError } from '@/domain/shared';
import { Response } from 'express';
import { UserAlreadyExistsError, UserNotFoundError } from '@/domain/user';
import {
  EmailAlreadyInUseError,
  InactiveUserError,
  InvalidCredentialsError,
  InvalidRefreshTokenError,
  UnauthorizedError,
} from '@/domain/auth';
import {
  EquipmentRentalNotFoundError,
  RoomBookingNotFoundError,
  RoomNotAvailableError,
  RoomTypeNotAllowedError,
  UnauthorizedBookingError,
} from '@/domain/booking';
import {
  EquipmentAlreadyInactiveError,
  EquipmentNotAvailableError,
  EquipmentNotFoundError,
} from '@/domain/equipment';
import {
  RoomAlreadyInactiveError,
  RoomNotAvailableForTypeError,
  RoomNotFoundError,
} from '@/domain/room';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: DomainError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = this.resolveStatus(exception);

    this.logger.warn(
      `DomainError [${status}] ${exception.constructor.name}: ${exception.message}`,
    );

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
    });
  }

  private resolveStatus(exception: DomainError): number {
    if (
      exception instanceof UserNotFoundError ||
      exception instanceof RoomNotFoundError ||
      exception instanceof EquipmentNotFoundError ||
      exception instanceof RoomBookingNotFoundError ||
      exception instanceof EquipmentRentalNotFoundError
    ) {
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

    if (
      exception instanceof InactiveUserError ||
      exception instanceof UnauthorizedError ||
      exception instanceof UnauthorizedBookingError
    ) {
      return HttpStatus.FORBIDDEN;
    }

    if (
      exception instanceof RoomAlreadyInactiveError ||
      exception instanceof EquipmentAlreadyInactiveError
    ) {
      return HttpStatus.GONE;
    }

    if (
      exception instanceof RoomNotAvailableError ||
      exception instanceof RoomNotAvailableForTypeError ||
      exception instanceof RoomTypeNotAllowedError ||
      exception instanceof EquipmentNotAvailableError
    ) {
      return HttpStatus.UNPROCESSABLE_ENTITY;
    }

    return HttpStatus.BAD_REQUEST;
  }
}
