import type { Item } from '@/db';

export const mockData: Item[] = [
  {
    id: 'training-shortsword',
    icon: 'https://i.imgur.com/QY6zecI.png',
    name: 'training shortsword with very long name that exceeds 3 lines of text',
    entityType: 'item',
    tier: '1',
    rarity: 'common',
    category: 'weapon',
    attributes: [{ name: 'shortsword damage', valueMin: 4, valueMax: 6 }],
    craftOptions: [
      {
        building: { name: 'workbench', tier: '1' },
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
    icon: 'https://i.imgur.com/Tsp1Sae.png',
    name: 'grass shirt',
    tier: '1',
    entityType: 'item',
    rarity: 'common',
    category: 'cosmetic clothes',
    requirements: [
      {
        level: 1,
      },
    ],
    attributes: [{ name: 'armor', valueMin: 1 }],
  },
  {
    id: 'grass-waistwrap',
    name: 'grass waistwrap',
    tier: '1',
    entityType: 'item',
    rarity: 'common',
    category: 'cosmetic clothes',
    requirements: [
      {
        level: 1,
      },
    ],
    attributes: [{ name: 'armor', valueMin: 1 }],
  },
  {
    id: 'grass-sandals',
    name: 'grass sandals',
    tier: '1',
    entityType: 'item',
    rarity: 'common',
    category: 'cosmetic clothes',
    requirements: [
      {
        level: 1,
      },
    ],
    attributes: [{ name: 'armor', valueMin: 1 }],
  },
  {
    id: 'hex-coin',
    name: 'hex coin',
    rarity: 'common',
    category: 'coins',
    entityType: 'item',
  },
  {
    id: 'basic-clay-lump',
    name: 'basic clay lump',
    rarity: 'common',
    tier: '1',
    entityType: 'item',
    craftOptions: [
      {
        level: 1,
        profession: 'foraging',
        tool: { name: 'machete', tier: '1' },
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
    tier: '1',
    entityType: 'item',
    category: 'basic food',
    attributes: [{ name: 'saturation', valueMin: 25 }],
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
        tool: { name: 'pot', tier: '1' },
        building: { name: 'cooking station', tier: '1' },
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
    tier: '1',
    entityType: 'item',
    category: 'tool bundle',
    craftOptions: [
      {
        level: 1,
        profession: 'carpentry',
        building: { name: 'workbench', tier: '1' },
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
    tier: '1',
    category: 'tool bundle',
    entityType: 'item',
  },
  {
    id: 'rusty-shortsword',
    name: 'rusty shortsword',
    tier: '1',
    entityType: 'item',
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
        name: 'shortsword damage',
        valueMin: 7,
        valueMax: 10,
      },
    ],
  },
  {
    id: 'flint-bow',
    name: 'flint bow',
    rarity: 'common',
    tier: '1',
    entityType: 'item',
    category: 'hunter tool',
    attributes: [
      {
        name: 'bow power',
        valueMin: 8,
      },
      { name: 'hunting bow damage', valueMin: 10, valueMax: 20 },
    ],
    craftOptions: [
      {
        level: 1,
        building: { name: 'workbench', tier: '1' },
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
    rarity: 'common',
    tier: '1',
    entityType: 'item',
    category: 'blacksmith tool',
    attributes: [
      {
        name: 'hammer power',
        valueMin: 8,
      },
    ],
    requirements: [{ level: 1, skill: 'smithing ' }],
    craftOptions: [
      {
        profession: 'carpentry',
        level: 1,
        building: {
          name: 'workbench',
          tier: '1',
        },
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
