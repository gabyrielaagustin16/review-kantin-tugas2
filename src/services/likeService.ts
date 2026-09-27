import {
  LikeRepository,
  type CreateLikeInput,
} from '../repositories/likeRepository.ts';

export class LikeService {
  private likeRepository: LikeRepository;

  constructor(
    likeRepository: LikeRepository = new LikeRepository(),
  ) {
    this.likeRepository = likeRepository;
  }

  async createLike(input: CreateLikeInput) {
    return this.likeRepository.create(input);
  }

  async deleteLike(reviewId: number, userId: number) {
    const row = await this.likeRepository.remove(
      reviewId,
      userId,
    );

    if (!row) {
      throw new Error('LIKE_NOT_FOUND');
    }

    return row;
  }
}