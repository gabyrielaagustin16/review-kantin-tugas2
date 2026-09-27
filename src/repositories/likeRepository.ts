import { and, eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { likes } from '../db/schema.ts';

export interface CreateLikeInput {
  reviewId: number;
  userId: number;
}

export class LikeRepository {
  async create(input: CreateLikeInput) {
    const db = await getDb();

    const rows = await db
      .insert(likes)
      .output()
      .values({
        reviewId: input.reviewId,
        userId: input.userId,
      });

    return rows[0];
  }

  async remove(reviewId: number, userId: number) {
    const db = await getDb();

    const rows = await db
      .delete(likes)
      .where(
        and(
          eq(likes.reviewId, reviewId),
          eq(likes.userId, userId),
        ),
      )
      .output();

    return rows[0];
  }
}