import type {
  craftingProfessions,
  craftingStations,
  craftingTools,
  entityTypes,
  itemCategories,
  itemEffectTimeUnits,
  itemEffects,
  itemRarities,
  itemTiers,
} from '@/constants';
import type { FormifyAllowEmptyStrings } from '@/types';

export type ItemTiers = (typeof itemTiers)[number];
export type ItemCategories = (typeof itemCategories)[number];
export type ItemRarities = (typeof itemRarities)[number];
export type CraftingProfessions = (typeof craftingProfessions)[number];
export type CrafingBuildings = (typeof craftingStations)[number];
export type CraftingTools = (typeof craftingTools)[number];
export type EffectsList = (typeof itemEffects)[number];
export type TimeUnits = (typeof itemEffectTimeUnits)[number];
export type EntityType = (typeof entityTypes)[number];

export interface ItemRequirement {
  level: number;
  skill?: string;
}
export interface ItemAttribute {
  name: string;
  valueMin: number;
  valueMax?: number;
  percentage?: boolean;
}

export interface ItemEffectAttribute {
  name: string;
  value: number;
  timeUnit: TimeUnits;
}

export interface ItemEffect {
  name: EffectsList;
  attributes: ItemEffectAttribute[];
}

export interface ItemCraftOption {
  level: number;
  profession: CraftingProfessions;
  building?: {
    name: CrafingBuildings;
    tier: ItemTiers;
  };
  tool?: {
    name: CraftingTools;
    tier: ItemTiers;
  };
  input: ItemMaterial[];
  output: ItemMaterial[];
}

export interface ItemMaterial {
  id: Item['id'];
  quantity: number;
}

export interface Item {
  id: string;
  name: string;
  rarity: ItemRarities;
  category: ItemCategories;
  entityType: EntityType;
  icon?: string;
  tier?: ItemTiers;
  effects?: ItemEffect[];
  attributes?: ItemAttribute[];
  requirements?: ItemRequirement[];
  craftOptions?: ItemCraftOption[];
}

export type ItemForm = FormifyAllowEmptyStrings<Item>;
