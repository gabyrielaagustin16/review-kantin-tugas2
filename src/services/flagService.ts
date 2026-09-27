import {
  FlagRepository,
  type UpdateFlagInput,
} from '../repositories/flagRepository.ts';

export class FlagService {
  private flagRepository: FlagRepository;

  constructor(
    flagRepository: FlagRepository = new FlagRepository(),
  ) {
    this.flagRepository = flagRepository;
  }

  async getAllFlags() {
    return this.flagRepository.findAll();
  }

  async updateFlagStatus(
    id: number,
    input: UpdateFlagInput,
  ) {
    const row = await this.flagRepository.updateStatus(
      id,
      input,
    );

    if (!row) {
      throw new Error('FLAG_NOT_FOUND');
    }

    return row;
  }
}