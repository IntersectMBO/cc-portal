import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailDto } from '../dto/email.dto';
import { InternalServerErrorException } from '@nestjs/common';

describe('EmailService', () => {
  let service: EmailService;
  const mockMailerService = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Sending email', () => {
    it('should send an email successfully', async () => {
      const emailDto = {
        to: 'receiver-email',
        subject: 'Subject title',
      } as EmailDto;

      mockMailerService.sendMail.mockResolvedValueOnce('success');
      await service.sendEmail(emailDto);
      expect(mockMailerService.sendMail).toHaveBeenCalledWith(emailDto);
    });

    it('should an throw error when sending an email', async () => {
      const emailDto = {
        to: undefined,
        subject: undefined,
      } as EmailDto;

      mockMailerService.sendMail.mockRejectedValueOnce(
        new InternalServerErrorException(),
      );
      await expect(service.sendEmail(emailDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
