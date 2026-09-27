import type { Request, Response } from 'express';
import { ReviewService } from '../services/reviewService.ts';

export class ReviewController {
  private reviewService: ReviewService;

  constructor(
    reviewService: ReviewService = new ReviewService(),
  ) {
    this.reviewService = reviewService;
  }

  getReviews = async (
    _req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const reviews = await this.reviewService.getAllReviews();

      return res.status(200).json({
        status: 'success',
        data: reviews,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  createReview = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const review = await this.reviewService.createReview(req.body);

      return res.status(201).json({
        status: 'success',
        data: review,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  deleteReview = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const review = await this.reviewService.deleteReview(
        Number(req.params.id),
      );

      return res.status(200).json({
        status: 'success',
        data: review,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'REVIEW_NOT_FOUND'
      ) {
        return res.status(404).json({
          status: 'fail',
          message: 'Review tidak ditemukan',
        });
      }

      return res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}