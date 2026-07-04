import { Token } from '@/domain/auth';
import { DomainError } from '@/domain/shared';

describe('TokenVO', () => {
  describe('Creation Flow', () => {
    it('should successfully create a valid token and return its string value', () => {
      const rawToken = 'valid_token';

      const token = new Token(rawToken);

      expect(token.toString()).toBe(rawToken);
    });
  });

  describe('Validation Flow', () => {
    it('should throw an DomainError if the token is an empty string', () => {
      expect(() => new Token('')).toThrow(DomainError);
    });

    it('should throw an DomainError if the  token contains only white spaces', () => {
      expect(() => new Token('    ')).toThrow(DomainError);
    });

    it('should throw an DomainError if the token is null or undefined in runtime', () => {
      expect(() => new Token(null as unknown as string)).toThrow(DomainError);
      expect(() => new Token(undefined as unknown as string)).toThrow(
        DomainError,
      );
    });
  });
});
