import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { UserDto } from 'src/users/dto/user.dto';
import * as jwt from 'jsonwebtoken';
import { UserStatusEnum } from '../../users/enums/user-status.enum';
import { UnauthorizedException } from '@nestjs/common';
import { Role } from '../../users/entities/role.entity';

describe('AuthService', () => {
  let service: AuthService;

  const mockRoles: Role[] = [
    {
      id: '1',
      code: 'admin',
      users: null,
      permissions: null,
      createdAt: null,
      updatedAt: null,
    },
    {
      id: '2',
      code: 'super_admin',
      users: null,
      permissions: null,
      createdAt: null,
      updatedAt: null,
    },
    {
      id: '3',
      code: 'user',
      users: null,
      permissions: null,
      createdAt: null,
      updatedAt: null,
    },
  ];

  const userDto: UserDto = {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com',
    description: 'Lorem ipsum',
    profilePhotoUrl: 'path/to/photo.jpg',
    status: UserStatusEnum.ACTIVE,
    hotAddresses: ['address1', 'address2'],
    role: mockRoles[2].code,
    permissions: [],
    createdAt: null,
    updatedAt: null,
  };

  const mockConfigService = {
    getOrThrow: jest.fn((key: string) => {
      switch (key) {
        case 'ACCESS_SECRET':
          return 'test_access_secret';
        case 'JWT_ACCESS_TOKEN_EXPIRES_IN':
          return '1h';
        case 'REFRESH_SECRET':
          return 'test_refresh_secret';
        case 'JWT_REFRESH_TOKEN_EXPIRES_IN':
          return '7d';
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('issueAccessToken', () => {
    it('should issue an access token', () => {
      const payload = {
        userId: userDto.id,
        email: userDto.email,
        role: userDto.role,
        permissions: userDto.permissions,
      };
      const accessToken = service.issueAccessToken(payload);
      const decodedToken = jwt.verify(
        accessToken,
        'test_access_secret',
      ) as jwt.JwtPayload;

      expect(decodedToken.userId).toBe(payload.userId);
      expect(decodedToken.email).toBe(payload.email);
      expect(decodedToken.role).toBe(payload.role);
      expect(decodedToken.permissions).toEqual(payload.permissions);
    });

    it('should throw an error if payload is missing', () => {
      //we call issueAccessToken without the payload
      expect(() => {
        service.issueAccessToken(null);
      }).toThrow();
    });
  });

  describe('issueRefreshToken', () => {
    it('should issue a refresh token', () => {
      const payload = {
        userId: userDto.id,
        email: userDto.email,
        role: userDto.role,
        permissions: userDto.permissions,
      };
      const refreshToken = service.issueRefreshToken(payload);
      const decodedToken = jwt.verify(
        refreshToken,
        'test_refresh_secret',
      ) as jwt.JwtPayload;

      expect(decodedToken.userId).toBe(payload.userId);
      expect(decodedToken.email).toBe(payload.email);
      expect(decodedToken.role).toBe(payload.role);
      expect(decodedToken.permissions).toEqual(payload.permissions);
    });

    it('should throw an error if payload is missing', () => {
      //we call issueRefreshToken without the payload
      expect(() => {
        service.issueRefreshToken(null);
      }).toThrow();
    });
  });

  describe('validateRefreshToken', () => {
    it('should validate a refresh token', () => {
      const payload = {
        userId: userDto.id,
        email: userDto.email,
      };
      const refreshToken = jwt.sign(payload, 'test_refresh_secret');
      const decodedToken = service.validateRefreshToken(refreshToken);

      expect(decodedToken).toEqual(payload);
    });

    it('should throw an UnauthorizedException for invalid refresh token', () => {
      const invalidToken = 'invalid_token';

      expect(() => {
        service.validateRefreshToken(invalidToken);
      }).toThrow(UnauthorizedException);
    });

    it('should throw a BadRequestException for refresh token with invalid payload structure', () => {
      const payload = {
        //missing 'userId' and 'email' fields
        role: userDto.role,
        permissions: userDto.permissions,
      };
      const refreshToken = jwt.sign(payload, 'test_refresh_secret');

      expect(() => {
        service.validateRefreshToken(refreshToken);
      }).toThrow(UnauthorizedException);
    });
  });
});
