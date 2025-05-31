import type { Item } from './types';

export const mockData: Item[] = [
  {
    id: 'training-shortsword',
    name: 'training shortsword',
    tier: 1,
    rarity: 'common',
    category: 'weapon',
    attributes: [{ name: 'shortsword damage', value: [4, 6] }],
    craftOptions: [
      {
        building: 'workbench',
        level: 1,
        profession: 'carpentry',
        input: [
          {
            id: 'stick',
            quantity: 5,
          },
        ],
        output: [{ id: 'training-shortsword', quantity: 1 }],
      },
    ],
  },
  {
    id: 'grass-shirt',
    name: 'grass shirt',
    tier: 1,
    rarity: 'common',
    category: 'cosmetic clothes',
    requirements: [
      {
        level: 1,
      },
    ],
    attributes: [{ name: 'armor', value: 1 }],
  },
  {
    id: 'grass-waistwrap',
    name: 'grass waistwrap',
    tier: 1,
    rarity: 'common',
    category: 'cosmetic clothes',
    requirements: [
      {
        level: 1,
      },
    ],
    attributes: [{ name: 'armor', value: 1 }],
  },
  {
    id: 'grass-sandals',
    name: 'grass sandals',
    tier: 1,
    rarity: 'common',
    category: 'cosmetic clothes',
    requirements: [
      {
        level: 1,
      },
    ],
    attributes: [{ name: 'armor', value: 1 }],
  },
  {
    id: 'hex-coin',
    name: 'hex coin',
    rarity: 'common',
    category: 'coins',
  },
  {
    id: 'basic-clay-lump',
    name: 'basic clay lump',
    rarity: 'common',
    tier: 1,
    craftOptions: [
      {
        level: 1,
        profession: 'foraging',
        tool: 'machete',
        input: [{ id: 'mud-mound', quantity: 1 }],
        output: [
          {
            id: 'basic-clay-lump',
            quantity: 1,
          },
          {
            id: 'rough-gypsite',
            quantity: 1,
          },
        ],
      },
    ],
    category: 'clay',
  },
  {
    id: 'plain-mushroom-skewer',
    name: 'plain mushroom skewer',
    rarity: 'common',
    tier: 1,
    category: 'basic food',
    attributes: [{ name: 'saturation', value: 25 }],
    effects: [
      {
        name: 'food regen',
        attributes: [
          { name: 'health regen', value: 0.8, timeUnit: 's' },
          { name: 'stamina regen', value: 5, timeUnit: 's' },
        ],
      },
    ],
    craftOptions: [
      {
        level: 1,
        profession: 'cooking',
        tool: 'pot',
        building: 'cooking station',
        input: [
          {
            id: 'basic-mushroom',
            quantity: 5,
          },
        ],
        output: [{ id: 'plain-mushroom-skewer', quantity: 1 }],
      },
    ],
  },

  {
    id: 'flint-tool-bundle',
    name: 'flint tool bundle',
    rarity: 'common',
    tier: 1,
    category: 'tool bundle',
    craftOptions: [
      {
        level: 1,
        profession: 'carpentry',
        building: 'workbench',
        input: [
          {
            id: 'kanpped-flint',
            quantity: 3,
          },
          {
            id: 'stick',
            quantity: 3,
          },
        ],
        output: [{ id: 'flint-tool-bundle', quantity: 1 }],
      },
    ],
  },
  {
    id: 'flint-tool-bundle-2',
    name: 'flint tool bundle II',
    rarity: 'common',
    tier: 1,
    category: 'tool bundle',
  },
  {
    id: 'rusty-shortsword',
    name: 'rusty shortsword',
    tier: 1,
    rarity: 'uncommon',
    category: 'weapon',
    requirements: [
      {
        level: 1,
        skill: 'slayer',
      },
    ],
    attributes: [
      {
        name: 'shortsword damange',
        value: [7, 10],
      },
    ],
  },
  {
    id: 'flint-bow',
    name: 'flint bow',
    rarity: 'common',
    tier: 1,
    category: 'hunter tool',
    attributes: [
      {
        name: 'bow power',
        value: 8,
      },
      { name: 'hunting bow damage', value: [10, 20] },
    ],
    craftOptions: [
      {
        level: 1,
        building: 'workbench',
        profession: 'carpentry',
        input: [
          {
            id: 'knapped-flint',
            quantity: 1,
          },
          {
            id: 'stick',
            quantity: 1,
          },
        ],
        output: [{ id: 'flitn-bow', quantity: 1 }],
      },
    ],
  },
  {
    id: 'flint-hammer',
    name: 'flint hammer',
    rarity: 'comon',
    tier: 1,

    category: 'blacksmith tool',
    attributes: [
      {
        name: 'hammer power',
        value: 8,
      },
    ],
    requirements: [{ level: 1, skill: 'smithing ' }],
    craftOptions: [
      {
        profession: 'carpentry',
        level: 1,
        building: 'workbench',
        input: [
          { id: 'knapped-flint', quantity: 1 },
          { id: 'stick', quantity: 1 },
        ],
        output: [
          {
            id: 'flint-hammer',
            quantity: 1,
          },
        ],
      },
    ],
  },
];
