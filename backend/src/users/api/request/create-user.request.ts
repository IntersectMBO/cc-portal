import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, MaxLength } from "class-validator";

export class CreateUserRequest {
  @ApiProperty({
    description: "Email address of the user",
    example: "john.doe@example.com",
  })
  @MaxLength(80, { message: `Maximum character length is 80` })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "List of roles of the user",
    example: ["user"],
  })
  @IsArray()
  roles: string[];

  @ApiProperty({
    description: "List of permissions of the user",
    example: ["add_constitution_version"],
  })
  @IsArray()
  permissions: string[];
}
