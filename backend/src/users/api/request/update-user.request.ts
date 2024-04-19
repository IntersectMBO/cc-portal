import { ApiProperty } from '@nestjs/swagger';
import {
  MinLength,
  MaxLength,
  Matches,
  IsString,
  ValidateIf,
  IsOptional,
} from 'class-validator';

export class UpdateUserRequest {
  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
  })
  @MinLength(2, { message: `Minimum character length is 2` })
  @MaxLength(30, { message: `Maximum character length is 30` })
  @Matches(/^[a-zA-Z0-9_.\s]+$/, {
    message: `Name can't contain special characters & symbols`,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the user',
    example:
      'As an enthusiastic individual deeply passionate about blockchain technology,I am committed to exploring and advancing the transformative potential of decentralized systems.',
  })
  @MinLength(2, { message: `Minimum character length is 2` })
  @MaxLength(500, { message: `Maximum character length is 500` })
  //allowed every character
  @ValidateIf((e) => e.description !== '')
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Hot address of the user',
    example: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  })
  @IsOptional()
  @IsString({ each: true, message: 'Hot address must be a string' })
  @MinLength(2, { message: `Minimum character length is 2`, each: true })
  @MaxLength(255, { message: `Maximum character length is 255`, each: true })
  @Matches(/^[a-zA-Z0-9_.:\-\/]+$/, {
    message: `Hot address can contain :, -, /`,
    each: true,
  })
  hotAddress: string;
}
