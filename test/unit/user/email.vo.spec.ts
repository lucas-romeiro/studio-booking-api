import { DomainError } from '@/domain/shared';
import { Email } from '@/domain/user';

describe('Email Value Object', () => {
  describe('Creation and Sanitization Flow', () => {
    it('should successfully create a valid email converted to lowercase', () => {
      const email = new Email('JOHN_DOE@EMAIL.COM');
      expect(email.toString()).toBe('john_doe@email.com');
    });

    it('should trim leading and trailing whitespaces from the email address', () => {
      const email = new Email('   john.doe@email.com   ');
      expect(email.toString()).toBe('john.doe@email.com');
    });
  });

  describe('Validation Flow (Invariants)', () => {
    it('should throw a DomainError with specific message if format is invalid', () => {
      const invalidEmail = 'its-not-an-email';

      expect(() => new Email(invalidEmail)).toThrow(DomainError);
      expect(() => new Email(invalidEmail)).toThrow(
        `Invalid Email address: ${invalidEmail}`,
      );
    });

    it('should reject structurally broken email strings', () => {
      expect(() => new Email('')).toThrow(DomainError);
      expect(() => new Email('@')).toThrow(DomainError);
      expect(() => new Email('jhon@')).toThrow(DomainError);
      expect(() => new Email('@email.com')).toThrow(DomainError);
      expect(() => new Email('jhon@email')).toThrow(DomainError);
    });
  });
});
