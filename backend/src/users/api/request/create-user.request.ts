import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MaxLength } from "class-validator";

export class CreateUserRequest {
  @ApiProperty({
    description: "Email address of the user",
    example: "john.doe@example.com",
  })
  @MaxLength(80, { message: `Maximum character length is 80` })
  @IsEmail()
  email: string;
}
