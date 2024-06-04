export class UserPhotoDto {
  userName: string;
  photoUrl: string;

  constructor(userName: string, photoUrl: string) {
    this.userName = userName;
    this.photoUrl = photoUrl;
  }
}
