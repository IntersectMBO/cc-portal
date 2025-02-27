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
  @MaxLength(64, { message: `Maximum character length is 64` })
  @Matches(/^[a-zA-Z0-9_|.\s]+$/, {
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
  @ValidateIf((e) => e.hotAddress !== '')
  @IsOptional()
  @IsString({ each: true, message: 'Hot address must be a string' })
  @Matches(/^[a-fA-F0-9]{56}$/, {
    message: `Hot address must be a 56-character hexadecimal code`,
    each: true,
  })
  hotAddress: string;
}
