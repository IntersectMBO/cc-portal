import { Test, TestingModule } from '@nestjs/testing';
import { ConstitutionService } from './constitution.service';

describe('ConstitutionService', () => {
  let service: ConstitutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConstitutionService],
    }).compile();

    service = module.get<ConstitutionService>(ConstitutionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
