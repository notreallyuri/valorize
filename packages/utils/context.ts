import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { prisma } from "@acme/utils";

export const createContext = async (opts: CreateFastifyContextOptions) => {
  try {
    const { req, res } = opts;

    const tokenPayload = await req.jwtVerify<{
      id: string;
      email: string;
      role: string;
    }>();

    const user = await prisma.user.findUnique({
      where: { id: tokenPayload.id },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        role: true,
      },
    });

    if (!user) {
      console.error("User from token not found in database");
      return { req, res, user: null };
    }

    console.log("Authenticated user", user);
    return { req, res, user };
  } catch (error) {
    const { req, res } = opts;
    console.error("JWT verification failed:", error);
    return { req, res, user: null };
  }
};

export type Context = Awaited<ReturnType<typeof createContext>>;
