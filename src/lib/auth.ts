// lib/auth.ts
import { createClient } from "redis";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { findUserByEmail, createUser } from "./db";
import { NextRequest, NextResponse } from "next/server";

const redisClient = createClient({
  url: "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis Client Error:", err));
(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
})();


const SALT_ROUNDS = 10;

// Register new user
export async function registerUser(
  username: string,
  email: string,
  password: string
) {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await createUser(uuidv4(), username, email, hashedPassword);
    return { success: true, user: newUser };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: "Failed to create user" };
  }
}

// Login and create session
export async function loginUser(email: string, password: string) {
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, error: "Invalid password" };
    }

    const token = uuidv4();
    await redisClient.set(`session:${token}`, user.id, {
      EX: 60 * 60 * 24, // 1 day
    });

    return { success: true, token };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Login failed" };
  }
}

// Logout: delete session
export async function logoutUser(token: string) {
  try {
    await redisClient.del(`session:${token}`);
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: "Logout failed" };
  }
}

// Check if session token is valid
export async function isAuthenticated(token: string | undefined) {
  if (!token) return false;

  try {
    const userId = await redisClient.get(`session:${token}`);
    return !!userId;
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
}


// Compare user-entered password with hashed password from DB
export async function comparePasswords(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// Generate a UUID-based token and store in Redis
export async function generateToken(user: { id: string }): Promise<string> {
  const token = uuidv4();

  // Store user.id in Redis with a token key
  await redisClient.set(`session:${token}`, user.id, {
    EX: 60 * 60 * 24, // 1 day expiry
  });

  return token;
}


// Middleware: protect or redirect routes
export async function authMiddleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const isAuth = await isAuthenticated(token);
  const path = req.nextUrl.pathname;

  if (path === "/dashboard" && !isAuth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if ((path === "/login" || path === "/signup") && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}
