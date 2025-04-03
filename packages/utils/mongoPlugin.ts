import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyPluginAsync,
} from "fastify";
import { MongoClient, Db } from "mongodb";
import { AppError } from "@acme/error";

interface MongoDBPluginOptions {
  uri: string;
  database: string;
}

export const mongodbPlugin: FastifyPluginAsync<MongoDBPluginOptions> = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions & MongoDBPluginOptions
) => {
  const { uri, database } = options;

  try {
    const client = new MongoClient(uri);
    await client.connect();

    const db: Db = client.db(database);

    fastify.decorate("mongo", db);
    fastify.addHook("onClose", async () => {
      await client.close();
      console.log("Disconnected from MongoDB");
    });
  } catch (error) {
    throw new AppError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error connecting to MongoDB",
      cause: error,
    });
  }
};

declare module "fastify" {
  interface FastifyInstance {
    mongo: Db;
  }
}
