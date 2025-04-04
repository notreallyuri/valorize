import fastify from "fastify";
import jwt from "@fastify/jwt";
import cors from "@fastify/cors";
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import { mongodbPlugin } from "./mongoPlugin";
import { AppError } from "@acme/error";
import { createContext } from "./context";
import { AppRouter, appRouter } from "@acme/routes";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

if (!jwtSecret || !clientUrl)
  throw new AppError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Error getting environment keys.",
  });

export const app = fastify({
  logger: {
    level: process.env.LOG_LEVEL || "info",
    transport:
      process.env.NODE_ENV !== "production"
        ? {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "SYS:standard",
              ignore: "pid,hostname",
            },
          }
        : undefined,
  },
  ajv: { customOptions: { removeAdditional: "all", coerceTypes: true } },
});

app.register(jwt, {
  secret: jwtSecret,
  cookie: { cookieName: "user_key", signed: false },
});

app.register(cors, {
  origin: clientUrl,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

await app.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: appRouter,
    createContext,
  } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
});
