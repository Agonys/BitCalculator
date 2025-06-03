type ItemCategories = string | 'weapon' | 'cosmetic clothes' | 'coins' | 'clay' | 'basic food';
type ItemRarities = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
type CraftingProfessions = string | 'carpentry' | 'foraging';
type CrafingBuildings = string | 'workbench' | '';
type CraftingTools = string | 'machete' | '';
type EffectsList = string | 'food regen' | '';
type TimeUnits = 's' | '';

export interface ItemRequirement {
  level: number | '';
  skill?: string;
}
export interface ItemAttribute {
  name: string;
  valueMin: number | '';
  valueMax?: number | '';
  percentage?: boolean;
}

export interface ItemEffectAttribute {
  name: string;
  value: number | '';
  timeUnit: TimeUnits;
}

export interface ItemEffect {
  name: EffectsList;
  attributes: ItemEffectAttribute[];
}

export interface ItemCraftOption {
  level: number | '';
  profession: CraftingProfessions;
  building?: CrafingBuildings;
  tool?: CraftingTools;
  input: ItemMaterial[];
  output: ItemMaterial[];
}

export interface Item {
  icon?: string;
  id: string;
  name: string;
  tier?: number;
  rarity: ItemRarities;
  category: ItemCategories;
  isResource?: true;
  attributes?: ItemAttribute[];
  requirements?: ItemRequirement[];
  effects?: ItemEffect[];
  craftOptions?: ItemCraftOption[];
}

export interface ItemMaterial {
  id: Item['id'];
  quantity: number | number[];
}

export type ItemSuggestion = Pick<Item, 'id' | 'name' | 'tier' | 'icon'>;
