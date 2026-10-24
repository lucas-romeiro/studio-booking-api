import { DomainExceptionFilter } from '@/interface/http/filters';
import { DomainError } from '@/domain/shared';
import { ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { UserAlreadyExistsError, UserNotFoundError } from '@/domain/user';
import {
  RoomBookingNotFoundError,
  RoomNotAvailableError,
  UnauthorizedBookingError,
} from '@/domain/booking';
import {
  InactiveUserError,
  InvalidCredentialsError,
  InvalidRefreshTokenError,
} from '@/domain/auth';

const mockJson = jest.fn();
const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
const mockGetResponse = jest.fn().mockReturnValue({ status: mockStatus });
const mockSwitchToHttp = jest.fn().mockReturnValue({
  getResponse: mockGetResponse,
});
const mockHost = {
  switchToHttp: mockSwitchToHttp,
} as unknown as ArgumentsHost;

describe('DomainExceptionFilter', () => {
  let filter: DomainExceptionFilter;

  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  beforeEach(() => {
    jest.clearAllMocks();
    filter = new DomainExceptionFilter();
  });

  const expectStatus = (exception: DomainError, status: HttpStatus) => {
    filter.catch(exception, mockHost);
    expect(mockStatus).toHaveBeenCalledWith(status);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: status,
        message: exception.message,
      }),
    );
  };

  it('retorna 404 para UserNotFoundError', () => {
    expectStatus(new UserNotFoundError('id'), HttpStatus.NOT_FOUND);
  });

  it('retorna 404 para RoomBookingNotFoundError', () => {
    expectStatus(new RoomBookingNotFoundError('id'), HttpStatus.NOT_FOUND);
  });

  it('retorna 409 para UserAlreadyExistsError', () => {
    expectStatus(new UserAlreadyExistsError('email'), HttpStatus.CONFLICT);
  });

  it('retorna 401 para InvalidCredentialsError', () => {
    expectStatus(new InvalidCredentialsError(), HttpStatus.UNAUTHORIZED);
  });

  it('retorna 401 para InvalidRefreshTokenError', () => {
    expectStatus(new InvalidRefreshTokenError(), HttpStatus.UNAUTHORIZED);
  });

  it('retorna 403 para InactiveUserError', () => {
    expectStatus(new InactiveUserError(), HttpStatus.FORBIDDEN);
  });

  it('retorna 403 para UnauthorizedBookingError', () => {
    expectStatus(new UnauthorizedBookingError(), HttpStatus.FORBIDDEN);
  });

  it('retorna 422 para RoomNotAvailableError', () => {
    expectStatus(new RoomNotAvailableError(), HttpStatus.UNPROCESSABLE_ENTITY);
  });

  it('retorna 400 para DomainError genérico', () => {
    expectStatus(new DomainError('erro genérico'), HttpStatus.BAD_REQUEST);
  });
});
