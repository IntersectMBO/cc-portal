import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersFacade } from '../facade/users.facade';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersFacade = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersFacade,
          useValue: mockUsersFacade,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
