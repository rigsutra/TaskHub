import {createClient} from 'redis';
import {v4 as uuidv4} from 'uuid';
import bcrypt from 'bcrypt';
import {getUserByEmail, createUser} from './db';
import {NextRequest, NextResponse} from 'next/server';

const redisClient = createClient({
  url: 'redis://localhost:6379',
});

redisClient.on('error', err => console.log('Redis Client Error', err));

redisClient.connect();

const SALT_ROUNDS = 10;

export async function registerUser(username: string, email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  try {
    const newUser = await createUser(username, email, hashedPassword);
    return {success: true, user: newUser};
  } catch (error) {
    console.error('Error creating user:', error);
    return {success: false, error: 'Failed to create user'};
  }
}

export async function loginUser(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) {
    return {success: false, error: 'User not found'};
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return {success: false, error: 'Invalid password'};
  }
  const token = uuidv4();
  await redisClient.set(`session:${token}`, user.id, {
    EX: 60 * 60 * 24,
  });
  return {success: true, token};
}

export async function logoutUser(token: string) {
  await redisClient.del(`session:${token}`);
  return {success: true};
}

export async function isAuthenticated(token: string | undefined) {
  if (!token) {
    return false;
  }
  const userId = await redisClient.get(`session:${token}`);
  return !!userId;
}

export async function authMiddleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (req.nextUrl.pathname === '/dashboard') {
    if (!await isAuthenticated(token)) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if(req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup') {
    if (await isAuthenticated(token)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}