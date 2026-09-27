import {
  ReviewRepository,
  type CreateReviewInput,
} from '../repositories/reviewRepository.ts';

export class ReviewService {
  private reviewRepository: ReviewRepository;

  constructor(
    reviewRepository: ReviewRepository = new ReviewRepository(),
  ) {
    this.reviewRepository = reviewRepository;
  }

  async getAllReviews() {
    return this.reviewRepository.findAll();
  }

  async createReview(input: CreateReviewInput) {
    return this.reviewRepository.create(input);
  }

  async deleteReview(id: number) {
    const row = await this.reviewRepository.remove(id);

    if (!row) {
      throw new Error('REVIEW_NOT_FOUND');
    }

    return row;
  }
}