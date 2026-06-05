import { DomainError } from '../../../src/domain/shared/errors';
import { Email } from '../../../src/domain/user';

describe('Email value object', () => {
  it('should create a valid email in lowercase', () => {
    const email = new Email('JOHN_DOE@EMAIL.COM');
    expect(email.toString()).toBe('john_doe@email.com');
  });

  it('it should throw an error with an invalid email format', () => {
    expect(() => new Email('its-not-an-email')).toThrow(DomainError);
    expect(() => new Email('')).toThrow(DomainError);
    expect(() => new Email('@')).toThrow(DomainError);
  });
});
