import {
  MenuItemRepository,
  type CreateMenuItemInput,
} from '../repositories/menuItemRepository.ts';
import type { MenuItemDto } from '../dtos/stallDto.ts';
import type { ClientInfo } from '../utils/clientInfo.ts';

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
    user?: { id: number; role: string },
    client: ClientInfo = { ipAddress: null, userAgent: null },
  ): Promise<MenuItemDto> {
    const row = await this.menuItemRepository.create(input, user, client);

    if (!row) {
      throw new Error('MENU_ITEM_NOT_FOUND');
    }

    return row;
  }

  async updateMenuItem(
    id: number,
    input: Partial<CreateMenuItemInput>,
    user?: { id: number; role: string },
    client: ClientInfo = { ipAddress: null, userAgent: null },
  ): Promise<MenuItemDto> {
    const row = await this.menuItemRepository.update(id, input, user, client);

    if (!row) {
      throw new Error('MENU_ITEM_NOT_FOUND');
    }

    return row;
  }

  async deleteMenuItem(
    id: number,
    user?: { id: number; role: string },
    client: ClientInfo = { ipAddress: null, userAgent: null },
  ): Promise<MenuItemDto> {
    const row = await this.menuItemRepository.remove(id, user, client);

    if (!row) {
      throw new Error('MENU_ITEM_NOT_FOUND');
    }

    return row;
  }
}
