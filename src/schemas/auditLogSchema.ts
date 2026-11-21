import { z } from 'zod';

const integerString = z.string()
  .regex(/^-?\d+$/, 'Harus berupa bilangan bulat')
  .transform(Number);

const positiveInteger = integerString
  .pipe(z.number().int().safe().positive('Harus lebih besar dari 0').max(2147483647, 'Nilai terlalu besar'));

const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Tanggal harus berformat YYYY-MM-DD')
  .refine((value) => {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year
      && date.getUTCMonth() === month - 1
      && date.getUTCDate() === day;
  }, 'Tanggal tidak valid');

export const auditLogListSchema = z.object({
  query: z.object({
    page: integerString
      .pipe(z.number().int().safe().min(1, 'Page harus berupa bilangan bulat minimal 1'))
      .default(1),
    pageSize: integerString
      .pipe(z.number().int().safe()
        .min(1, 'Page size harus berupa bilangan bulat dari 1 sampai 100')
        .max(100, 'Page size harus berupa bilangan bulat dari 1 sampai 100'))
      .default(20),
    action: z.string().max(50, 'Action maksimal 50 karakter').optional(),
    targetTable: z.string().max(50, 'Target table maksimal 50 karakter').optional(),
    targetId: positiveInteger.optional(),
    userId: positiveInteger.optional(),
    from: dateSchema.optional(),
    to: dateSchema.optional(),
  }).strict().refine((query) => !(query.from && query.to) || query.from <= query.to, {
    message: 'Tanggal from tidak boleh lebih besar daripada to',
    path: ['from'],
  }),
});

export const auditLogDetailSchema = z.object({
  params: z.object({
    id: positiveInteger,
  }).strict(),
});
