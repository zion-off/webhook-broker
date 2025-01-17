import jwt from "jsonwebtoken";

export function generateHash(password: string) {
  return "#" + password + "#";
}

export const signToken = (payload: string) => {
  return jwt.sign(
    {
      payload,
    },
    process.env.AUTH_SECRET,
    { expiresIn: process.env.JWT_AGE }
  );
};
