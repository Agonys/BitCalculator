import {
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

export const checkItemDataDuplicates = () => {
  return [
    itemTiers,
    itemRarities,
    itemCategories,
    entityTypes,
    craftingProfessions,
    craftingStations,
    craftingTools,
    itemEffects,
    itemEffectTimeUnits,
  ].some((item) => item.length !== [...new Set([...item])].length);
};
