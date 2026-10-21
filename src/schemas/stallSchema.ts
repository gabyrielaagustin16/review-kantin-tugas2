import { z } from 'zod';

export const getStallsSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  }),
});

export const stallIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number({ message: 'ID warung harus berupa angka' })
      .int('ID warung harus berupa bilangan bulat')
      .positive('ID warung harus berupa angka positif'),
  }),
});

export const createStallSchema = z.object({
  body: z.object({
    name: z.string({ message: 'Nama warung wajib diisi' })
      .min(3, 'Nama warung minimal 3 karakter')
      .max(100, 'Nama warung maksimal 100 karakter'),
    category: z.string({ message: 'Kategori wajib diisi' })
      .max(50, 'Kategori maksimal 50 karakter'),
    location: z.string({ message: 'Lokasi wajib diisi' })
      .max(100, 'Lokasi maksimal 100 karakter'),
    description: z.string().max(1000, 'Deskripsi maksimal 1000 karakter').optional(),
  }),
});

export const updateStallSchema = z.object({
  params: z.object({
    id: z.coerce.number({ message: 'ID warung harus berupa angka' })
      .int('ID warung harus berupa bilangan bulat')
      .positive('ID warung harus berupa angka positif'),
  }),
  body: z.object({
    name: z.string().min(3, 'Nama warung minimal 3 karakter').max(100).optional(),
    category: z.string().max(50).optional(),
    location: z.string().max(100).optional(),
    description: z.string().max(1000).optional(),
  }),
});