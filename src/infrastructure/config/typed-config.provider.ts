import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypedConfigService } from './typed-config.service';

export const typedConfigProvider: Provider = {
  provide: TypedConfigService,
  useExisting: ConfigService,
};
