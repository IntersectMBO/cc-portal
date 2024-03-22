import { Expose } from "class-transformer";
import { UserResponse } from "src/users/api/response/user.response";

export class TokenResponse {
  @Expose({ name: "user" })
  user: UserResponse;

  @Expose({ name: "access_token" })
  accessToken: string;

  @Expose({ name: "refresh_token" })
  refreshToken: string;
}
