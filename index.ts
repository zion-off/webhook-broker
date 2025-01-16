import express from "express";
import { createClient } from "redis";
import cors from "cors";

import { setupRedis } from "@/utils";
import { errorHandler } from "./utils/error";
import router from "./routes";
import '@/handlers/worker.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use(errorHandler);

export let redis: ReturnType<typeof createClient>;

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

process.on("uncaughtException", function (err) {
  console.log(err);
});
