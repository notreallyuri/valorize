import {
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
  PrismaClientRustPanicError,
} from "@prisma/client/runtime/library";
import { AppError, PrismaError } from "@acme/error";

export function handleRepositoryError(error: any, operation: string): never {
  if (error instanceof AppError) {
    throw error; // Re-throw known AppErrors
  } else if (error instanceof PrismaClientKnownRequestError) {
    throw new PrismaError(error);
  } else if (
    error instanceof PrismaClientInitializationError ||
    error instanceof PrismaClientRustPanicError
  ) {
    // Handle connection or panic errors
    console.error(`Prisma error during ${operation}:`, error); // Log the error
    throw new AppError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Database error during ${operation}`,
      cause: error,
    });
  } else {
    // Generic error
    console.error(`Unexpected error during ${operation}:`, error); // Log the error
    throw new AppError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to perform ${operation}`,
      cause: error,
    });
  }
}
