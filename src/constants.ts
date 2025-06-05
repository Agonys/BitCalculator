import { createDropdownOptionsFromList } from './lib';

export const itemTiers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
export const itemRarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const;
export const itemCategories = [
  'weapon',
  'cosmetic clothes',
  'coins',
  'clay',
  'basic food',
  'blacksmith tool',
  'hunter tool',
  'tool bundle',
] as const;
export const entityTypes = ['item', 'node'] as const;

export const craftingProfessions = [
  'carpentry',
  'farming',
  'fishing',
  'foraging',
  'forestry',
  'hunting',
  'leatherworking',
  'masonry',
  'mining',
  'scholar',
  'smithing',
  'tailoring',
  'cooking',
] as const;

export const craftingStations = [
  'tailoring station tailoring station tailoring station tailoring station',
  'smelter',
  'fishing station',
  'grinder',
  'carpentry station',
  'forestry station',
  'kiln',
  'oven',
  'farming station',
  'scholar station',
  'leatherworking station',
  'smithing station',
  'loom',
  'workbench',
  'cooking station',
] as const;

export const craftingTools = [
  'saw',
  'pot',
  'hoe',
  'rod',
  'machete',
  'axe',
  'bow',
  'knife',
  'chisel',
  'pickaxe',
  'quill',
  'hammer',
  'scissors',
  'mallet',
] as const;

export const itemEffects = ['health regen', 'food regen'] as const;
export const itemEffectTimeUnits = ['s', 'h', 'm'] as const;

export const itemTiersDropdownOptions = createDropdownOptionsFromList({
  array: itemTiers,
  prefix: 'Tier',
});

export const itemRaritiesDropdownOptions = createDropdownOptionsFromList({
  array: itemRarities,
});

export const itemCategoriesDropdownOptions = createDropdownOptionsFromList({
  array: itemCategories,
});

export const itemEntityTypesDropdownOptions = createDropdownOptionsFromList({
  array: entityTypes,
});

export const itemCraftingProfessionsDropdownOptions = createDropdownOptionsFromList({
  array: craftingProfessions,
});
export const itemCraftingStationsDropdownOptions = createDropdownOptionsFromList({
  array: craftingStations,
});
export const itemCraftingToolsDropdownOptions = createDropdownOptionsFromList({
  array: craftingTools,
});
