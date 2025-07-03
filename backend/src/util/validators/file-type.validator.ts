import { FileValidator } from '@nestjs/common';

export class FileTypeValidator extends FileValidator<
  null,
  Express.Multer.File
> {
  constructor(private readonly allowedTypes: string[]) {
    super(null);
  }

  isValid(file: Express.Multer.File): boolean {
    return this.allowedTypes.includes(file.mimetype);
  }

  buildErrorMessage(): string {
    return `Invalid file type. Allowed: ${this.allowedTypes.join(', ')}`;
  }
}
