import {
  MenuItemRepository,
  type CreateMenuItemInput,
} from '../repositories/menuItemRepository.ts';
import type { MenuItemDto } from '../dtos/stallDto.ts';

export class MenuItemService {
  private menuItemRepository: MenuItemRepository;

  constructor(
    menuItemRepository: MenuItemRepository = new MenuItemRepository(),
  ) {
    this.menuItemRepository = menuItemRepository;
  }

  async getAllMenuItems(): Promise<MenuItemDto[]> {
    return this.menuItemRepository.findAll();
  }

  async getMenuItemById(id: number): Promise<MenuItemDto> {
    const row = await this.menuItemRepository.findById(id);

    if (!row) {
      throw new Error('MENU_ITEM_NOT_FOUND');
    }

    return row;
  }

  async getMenuItemsByStallId(
    stallId: number,
  ): Promise<MenuItemDto[]> {
    return this.menuItemRepository.findByStallId(stallId);
  }

  async createMenuItem(
    input: CreateMenuItemInput,
  ): Promise<MenuItemDto> {
    const row = await this.menuItemRepository.create(input);

    if (!row) {
      throw new Error('MENU_ITEM_NOT_FOUND');
    }

    return row;
  }

  async updateMenuItem(
    id: number,
    input: Partial<CreateMenuItemInput>,
  ): Promise<MenuItemDto> {
    const row = await this.menuItemRepository.update(id, input);

    if (!row) {
      throw new Error('MENU_ITEM_NOT_FOUND');
    }

    return row;
  }

  async deleteMenuItem(id: number): Promise<MenuItemDto> {
    const row = await this.menuItemRepository.remove(id);

    if (!row) {
      throw new Error('MENU_ITEM_NOT_FOUND');
    }

    return row;
  }
}
