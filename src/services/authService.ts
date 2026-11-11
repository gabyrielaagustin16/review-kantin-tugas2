import * as bcrypt from 'bcryptjs';
import { timingSafeEqual } from 'node:crypto';
import { getDb } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { signToken, type AuthUser } from './tokenService';
import { AppError } from '../errors/AppError';
import { UnauthorizedError } from '../errors/UnauthorizedError';

const bcryptHashPattern = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

function matchesLegacyPassword(input: string, stored: string) {
  const inputBuffer = Buffer.from(input);
  const storedBuffer = Buffer.from(stored);

  return inputBuffer.length === storedBuffer.length && timingSafeEqual(inputBuffer, storedBuffer);
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  const db = await getDb();

  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, input.email));

  if (existingUsers.length > 0) {
    throw new AppError(400, 'Email sudah terdaftar');
  }

  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
  const hashedPassword = await bcrypt.hash(input.password, saltRounds);

  await db.insert(users).values({
    name: input.name,
    email: input.email,
    passwordHash: hashedPassword,
    role: 'customer',
  });

  const [newUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, input.email));

  if (!newUser) {
    throw new AppError(500, 'Gagal membuat pengguna baru');
  }

  const authUser: AuthUser = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role as 'admin' | 'owner' | 'customer',
  };

  const token = signToken(authUser);

  return {
    user: authUser,
    token,
  };
}

export async function loginUser(input: {
  email: string;
  password: string;
}) {
  const db = await getDb();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, input.email));

  if (!user) {
    throw new UnauthorizedError('Email atau password salah');
  }

  let isPasswordValid = false;
  if (bcryptHashPattern.test(user.passwordHash)) {
    isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
  } else if (matchesLegacyPassword(input.password, user.passwordHash)) {
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
    const hashedPassword = await bcrypt.hash(input.password, saltRounds);

    await db
      .update(users)
      .set({ passwordHash: hashedPassword })
      .where(eq(users.id, user.id));

    isPasswordValid = true;
  }

  if (!isPasswordValid) {
    throw new UnauthorizedError('Email atau password salah');
  }

  const authUser: AuthUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as 'admin' | 'owner' | 'customer',
  };

  const token = signToken(authUser);

  return {
    user: authUser,
    token,
  };
}