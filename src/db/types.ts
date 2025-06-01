type ItemCategories = string | 'weapon' | 'cosmetic clothes' | 'coins' | 'clay' | 'basic food';
type ItemRarites = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
type CraftingProfessions = string | 'carpentry' | 'foraging';
type CrafingBuildings = string | 'workbench' | '';
type CraftingTools = string | 'machete' | '';
type EffectsList = string | 'food regen' | '';
type TimeUnits = 's' | '';

export interface ItemRequirement {
  level: number | '';
  skill?: string;
}
export type ItemAttribute = {
  name: string;
  valueMin: number | '';
  valueMax?: number | '';
  percentage?: boolean;
};

export interface Item {
  id: string;
  name: string;
  tier?: number;
  rarity: ItemRarites;
  category: ItemCategories;
  attributes?: ItemAttribute[];
  requirements?: ItemRequirement[];
  effects?: Array<{
    name: EffectsList;
    attributes: Array<{
      name: string;
      value: number | '';
      timeUnit: TimeUnits;
    }>;
  }>;

  craftOptions?: Array<{
    level: number;
    profession: CraftingProfessions;
    building?: CrafingBuildings;
    tool?: CraftingTools;
    input: ItemMaterial[];
    output: ItemMaterial[];
  }>;
  icon?: string;
  isResource?: true;
}

export interface ItemMaterial {
  id: Item['id'];
  quantity: number | number[];
}

export type ItemSuggestion = Pick<Item, 'id' | 'name' | 'tier' | 'icon'>;
