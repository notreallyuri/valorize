import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "@acme/utils";
import { PrismaClient } from "@prisma/client";
import { UserSchema } from "@acme/schemas";
import { User } from "@prisma/client";
import { AppError, PrismaError } from "@acme/error";

interface RepositoryInterface {
  create(data: UserSchema): Promise<User>;
  get(id: string): Promise<User | null>;
  getAll(options?: {
    skip?: number;
    take?: number;
    orderBy?: { [key in keyof User]: "asc" | "desc" };
  }): Promise<User[]>;
  delete(id: string): Promise<void>;
  updatePassword(
    id: string,
    newPassword: string,
    oldPassword: string
  ): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
}

class Repository implements RepositoryInterface {
  constructor(private readonly db: PrismaClient) {}

  private handlePrismaError(error: any): void {
    if (error instanceof PrismaClientKnownRequestError)
      throw new PrismaError(error);
    else throw error;
  }

  async create(data: UserSchema): Promise<User> {
    try {
      const validatedData = UserSchema.parse(data);

      const existingUser = await this.db.user.findUnique({
        where: { email: validatedData.email },
      });

      if (existingUser) {
        throw new AppError({
          code: "BAD_REQUEST",
          message: "Email already in use",
        });
      }

      const { password, ...rest } = validatedData;

      const hash = await Bun.password.hash(password);
      return await this.db.user.create({
        data: { password: hash, ...rest },
      });
    } catch (error) {
      if (error instanceof AppError) throw error;

      this.handlePrismaError(error);

      throw new AppError({ code: "INTERNAL_SERVER_ERROR", cause: error });
    }
  }

  async getAll(options?: {
    skip?: number;
    take?: number;
    orderBy?: { [key in keyof User]: "asc" | "desc" };
  }): Promise<User[]> {
    try {
      return await this.db.user.findMany({
        skip: options?.skip,
        take: options?.take,
        orderBy: options?.orderBy,
      });
    } catch (error) {
      throw new AppError({ code: "INTERNAL_SERVER_ERROR", cause: error });
    }
  }

  async get(id: string): Promise<User | null> {
    try {
      return await this.db.user.findUnique({ where: { id } });
    } catch (error) {
      this.handlePrismaError(error);
      throw new AppError({ code: "INTERNAL_SERVER_ERROR", cause: error });
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.db.user.delete({ where: { id } });
      return;
    } catch (error) {
      this.handlePrismaError(error);
      throw new AppError({ code: "INTERNAL_SERVER_ERROR", cause: error });
    }
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    try {
      return await this.db.user.update({ where: { id }, data });
    } catch (error) {
      this.handlePrismaError(error);
      throw new AppError({ code: "INTERNAL_SERVER_ERROR", cause: error });
    }
  }

  async updatePassword(
    id: string,
    newPassword: string,
    oldPassword: string
  ): Promise<User> {
    try {
      const user = await this.db.user.findUnique({ where: { id } });
      if (!user) throw new AppError({ code: "NOT_FOUND" });

      if (!(await Bun.password.verify(oldPassword, user.password)))
        throw new AppError({ code: "BAD_REQUEST" });

      const hash = await Bun.password.hash(newPassword);

      return await this.db.user.update({
        where: { id },
        data: { password: hash },
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }
}

export const userRepository = new Repository(prisma);
