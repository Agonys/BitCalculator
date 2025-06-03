import { items } from '@/db';
import type { Item } from '@/db';

export const getItemById = (id: string) => {
  return items.findOne({ id });
};
