import { applyDecorators } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { config } from 'dotenv';
config();

export function ApiExcludeEndpointIfProduction() {
  const isProduction: boolean = process.env.ENVIRONMENT === 'production';
  return applyDecorators(...(isProduction ? [ApiExcludeEndpoint()] : []));
}
