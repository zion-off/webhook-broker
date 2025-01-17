import { redis } from "@/index";
import { generateHash } from "@/utils";
import { HttpError } from "@/utils";

export async function registerUser(username: string, password: string) {
  try {
    if (await redis.exists(`user:${username}`)) {
      throw new HttpError("User already exists", 400);
    }
    await redis.set(`user:${username}`, generateHash(password));
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError("Failed to register user", 500);
  }
}

export async function loginUser(username: string, password_hash: string) {
  try {
    const stored_hash = await redis.get(`user:${username}`);
    if (stored_hash) {
      return password_hash === stored_hash;
    } else throw new HttpError("User not registered", 401);
  } catch (error) {
    throw error;
  }
}
