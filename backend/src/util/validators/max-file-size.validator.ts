import { FileValidator } from '@nestjs/common';

export class MaxFileSizeValidator extends FileValidator<
  null,
  Express.Multer.File
> {
  constructor(private readonly maxSize: number) {
    super(null);
  }

  isValid(file: Express.Multer.File): boolean {
    return file.size <= this.maxSize;
  }

  buildErrorMessage(): string {
    return `File size must not exceed ${this.maxSize / (1024 * 1024)}MB.`;
  }
}
