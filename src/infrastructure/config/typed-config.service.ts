import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from './config-types';

@Injectable()
export class TypedConfigService extends ConfigService<ConfigType, true> {}
