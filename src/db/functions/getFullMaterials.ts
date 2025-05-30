import { items } from '@/db';
import type { Item } from '@/db';

interface ItemWithMaterials extends Item {
  required: {
    material: { id: string; quantity: number };
    item: ItemWithMaterials | null;
  }[];
}

export function getFullMaterials(itemId: string, quantity = 1): ItemWithMaterials | null {
  const item = items.findOne({ id: itemId });
  if (!item) return null;
  return {
    ...item,
    required: item.materials.map((mat) => ({
      material: mat,
      item: getFullMaterials(mat.id, mat.quantity * quantity),
    })),
  };
}
