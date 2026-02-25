export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
  }
}

export const toAppError = (error, fallbackMessage = "Internal server error") => {
  if (error instanceof AppError) {
    return error;
  }

  return new AppError(error?.message || fallbackMessage, error?.statusCode || 500);
};
