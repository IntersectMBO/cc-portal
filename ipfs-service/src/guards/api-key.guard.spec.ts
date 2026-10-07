import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiKeyGuard } from './api-key.guard.js';

describe('ApiKeyGuard', () => {
  const contextWithHeaders = (
    headers: Record<string, string | string[]>,
  ): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ headers }),
      }),
    }) as unknown as ExecutionContext;

  const guardWithKey = (key: string | undefined) =>
    new ApiKeyGuard({
      get: () => key,
    } as unknown as ConfigService);

  it('allows requests with the configured key', () => {
    const guard = guardWithKey('secret-key');
    expect(
      guard.canActivate(contextWithHeaders({ 'x-api-key': 'secret-key' })),
    ).toBe(true);
  });

  it('rejects requests without a key', () => {
    const guard = guardWithKey('secret-key');
    expect(() => guard.canActivate(contextWithHeaders({}))).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects requests with a wrong key', () => {
    const guard = guardWithKey('secret-key');
    expect(() =>
      guard.canActivate(contextWithHeaders({ 'x-api-key': 'secret-kez' })),
    ).toThrow(UnauthorizedException);
  });

  it('rejects requests with repeated key headers', () => {
    const guard = guardWithKey('secret-key');
    expect(() =>
      guard.canActivate(
        contextWithHeaders({ 'x-api-key': ['secret-key', 'secret-key'] }),
      ),
    ).toThrow(UnauthorizedException);
  });

  it('rejects all requests when no key is configured', () => {
    const guard = guardWithKey(undefined);
    expect(() =>
      guard.canActivate(contextWithHeaders({ 'x-api-key': '' })),
    ).toThrow(UnauthorizedException);
    expect(() =>
      guard.canActivate(contextWithHeaders({ 'x-api-key': 'undefined' })),
    ).toThrow(UnauthorizedException);
  });
});
