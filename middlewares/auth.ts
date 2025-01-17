import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const setAuthorizationHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Authorization"
  );
  next();
};

export const authorizeUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerHeader: string = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    
    jwt.verify(bearerToken, process.env.AUTH_SECRET, (error, username) => {
      if (error) return res.status(403).json({ Error: error.message });
      console.log(username);
      req.query.username = username;
      next();
    });
  } else {
    res.status(403).json({ Error: "Missing authorization header" });
  }
};
