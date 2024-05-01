import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthFacade } from '../facade/auth.facade';
import { MagicLoginStrategy } from '../strategy/magiclogin.strategy';
import { MagicRegisterStrategy } from '../strategy/magicregister.strategy';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthFacade = {};
  const mockMagicLoginStrategy = {};
  const mockMagicRegisterStrategy = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthFacade,
          useValue: mockAuthFacade,
        },
        {
          provide: MagicLoginStrategy,
          useValue: mockMagicLoginStrategy,
        },
        {
          provide: MagicRegisterStrategy,
          useValue: mockMagicRegisterStrategy,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
