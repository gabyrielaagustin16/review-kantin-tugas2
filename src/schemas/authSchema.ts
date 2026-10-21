import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string({ message: 'Nama wajib diisi' })
      .min(3, 'Nama minimal 3 karakter')
      .max(100, 'Nama maksimal 100 karakter'),
    email: z.string({ message: 'Email wajib diisi' })
      .email('Format email tidak valid')
      .max(150, 'Email maksimal 150 karakter')
      .trim()
      .lowercase(),
    password: z.string({ message: 'Password wajib diisi' })
      .min(8, 'Password minimal 8 karakter')
      .max(72, 'Password maksimal 72 karakter'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ message: 'Email wajib diisi' })
      .email('Format email tidak valid')
      .trim()
      .lowercase(),
    password: z.string({ message: 'Password wajib diisi' })
      .min(1, 'Password tidak boleh kosong'),
  }),
});