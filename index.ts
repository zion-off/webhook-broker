import express, { Request, Response, NextFunction } from "express";
import { createClient } from "redis";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let redis: ReturnType<typeof createClient>;

async function setupRedis() {
  try {
    const client = createClient();
    client.on("error", (err) => console.error("Redis Client Error:", err));
    await client.connect();
    console.log("Redis client connected");
    return client;
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    process.exit(1);
  }
}

async function main() {
  try {
    redis = await setupRedis();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error starting the application:", err);
    process.exit(1);
  }
}

main();
