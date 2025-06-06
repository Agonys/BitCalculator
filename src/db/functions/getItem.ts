import { items } from '@/db';

export const getItemById = (id: string) => {
  if (!id) {
    console.error('Id is required', { id });
    return null;
  }

  return items.findOne({ id });
};

export const getItemByName = (name: string) => {
  if (!name.trim()) {
    console.error(`name is required`, { name });
    return null;
  }
  return items.findOne({ name });
};
