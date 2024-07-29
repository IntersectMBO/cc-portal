import { applyDecorators } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { config } from 'dotenv';
import { EnvEnum } from '../enums/env.enum';
config();

export function ApiConditionalExcludeEndpoint() {
  const allowedEnv: EnvEnum[] = [EnvEnum.LOCAL, EnvEnum.DEV];
  const environment = process.env.ENVIRONMENT;
  const isAllowed: boolean = allowedEnv.includes(environment as EnvEnum);
  return applyDecorators(...(!isAllowed ? [ApiExcludeEndpoint()] : []));
}
