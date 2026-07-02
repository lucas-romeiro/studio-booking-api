import { Provider } from '@nestjs/common';
import { TOKEN_PORT } from '../../../../domain/auth';
import { JwtTokenAdapter } from '../jwt-token.adapter';

export const tokenProvider: Provider = {
  provide: TOKEN_PORT,
  useClass: JwtTokenAdapter,
};
