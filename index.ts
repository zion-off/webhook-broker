import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});