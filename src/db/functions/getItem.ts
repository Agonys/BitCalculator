import { items } from '@/db';

export const getItemById = (id: string) => {
  return items.findOne({ id });
};

export const getItemByName = (name: string) => {
  return items.findOne({ name });
};
