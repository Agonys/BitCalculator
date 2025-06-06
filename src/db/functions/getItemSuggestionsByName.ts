import { fuzzySearchItemsByName } from '@/db';
import type { Item } from '@/db';

export function getItemSuggestionsByName(itemName: string): Item[] {
  if (!itemName.trim()) return [];
  return fuzzySearchItemsByName.search(itemName, { limit: 3 }).map((r) => r.item);
}
