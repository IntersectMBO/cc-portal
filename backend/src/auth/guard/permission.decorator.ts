import { SetMetadata } from '@nestjs/common';

export const Permissions = (...args: string[]) =>
  SetMetadata('permissions', args);
