import { z } from 'zod';

export const createReviewSchema = z.object({
  params: z.object({
    id: z.coerce.number({ message: 'ID warung harus berupa angka' })
      .int('ID warung harus berupa bilangan bulat')
      .positive('ID warung harus berupa angka positif'),
  }),
  body: z.object({
    rating: z.number({ message: 'Rating wajib diisi' })
      .int('Rating harus berupa bilangan bulat')
      .min(1, 'Rating minimal 1')
      .max(5, 'Rating maksimal 5'),
    comment: z.string().max(1000, 'Komentar maksimal 1000 karakter').optional(),
  }),
});