import jwt from "jsonwebtoken";

export function generateHash(password: string) {
  return "#" + password + "#";
}

export const signToken = (payload: string) => {
  return jwt.sign(
    {
      username: payload,
    },
    process.env.AUTH_SECRET,
    { expiresIn: parseInt(process.env.JWT_AGE, 10) }
  );
};
