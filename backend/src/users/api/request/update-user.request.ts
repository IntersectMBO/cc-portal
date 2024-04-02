import { ApiProperty } from "@nestjs/swagger";
import { MinLength, MaxLength, Matches, IsString } from "class-validator";

export class UpdateUserRequest {
  @ApiProperty({
    description: "Name of the user",
    example: "John Doe",
  })
  @MinLength(2, { message: `Minimum character length is 2` })
  @MaxLength(30, { message: `Maximum character length is 30` })
  @Matches(/^[a-zA-Z0-9_.\s]+$/, {
    message: `Name can't contain special characters & symbols`,
  })
  @IsString()
  name: string;
}
