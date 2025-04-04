import { MongoClient, Db } from "mongodb";
import { logger } from "@acme/utils";
import { AppError } from "@acme/error";

class MongoDBClient {
  private static instance: MongoDBClient;
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private constructor() {}

  static getInstance(): MongoDBClient {
    if (!MongoDBClient.instance) {
      MongoDBClient.instance = new MongoDBClient();
    }
    return MongoDBClient.instance;
  }

  async connect() {
    if (this.client) return;

    try {
      const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
      const dbName = process.env.MONGODB_DB_NAME || "my-db";

      this.client = new MongoClient(uri);

      await this.client.connect();
      this.db = this.client.db(dbName);

      logger.info("MongoDB connected successfully");
    } catch (error) {
      logger.error("MongoDB connection error", error);
      throw error;
    }
  }

  async disconnect() {
    if (!this.client) return;

    try {
      await this.client.close();
      this.client = null;
      this.db = null;
      logger.info("MongoDB disconnected successfully");
    } catch (error) {
      logger.error("MongoDB disconnection error:", error);
      throw error;
    }
  }

  getDb(): Db {
    if (!this.db)
      throw new AppError({
        code: "BAD_REQUEST",
        message: "MongoDB not connected",
      });

    return this.db;
  }

  getClient(): MongoClient {
    if (!this.client) {
      throw new Error("MongoDB not connected");
    }
    return this.client;
  }
}

export const mongoClient = MongoDBClient.getInstance();
