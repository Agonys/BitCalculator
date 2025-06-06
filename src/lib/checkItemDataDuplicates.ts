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
  const arrays = [
    { name: 'itemTiers', data: itemTiers },
    { name: 'itemRarities', data: itemRarities },
    { name: 'itemCategories', data: itemCategories },
    { name: 'entityTypes', data: entityTypes },
    { name: 'craftingProfessions', data: craftingProfessions },
    { name: 'craftingStations', data: craftingStations },
    { name: 'craftingTools', data: craftingTools },
    { name: 'itemEffects', data: itemEffects },
    { name: 'itemEffectTimeUnits', data: itemEffectTimeUnits },
  ];

  const duplicatesFound = arrays.find(({ data }) => data.length !== new Set(data).size);

  if (duplicatesFound) {
    console.error(`Duplicates found in ${duplicatesFound.name}:`, duplicatesFound.data);
  }

  return !!duplicatesFound;
};
