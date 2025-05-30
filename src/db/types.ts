export interface ItemMaterial {
  id: string;
  quantity: number;
}

export interface Item {
  id: string;
  name: string;
  tier: number;
  rarity: string;
  category: string;
  levelReq: number;
  attributes: Record<string, number>;
  materials: ItemMaterial[];
  icon?: string;
}

export type ItemSuggestion = Pick<Item, 'id' | 'name' | 'tier' | 'icon'>;
