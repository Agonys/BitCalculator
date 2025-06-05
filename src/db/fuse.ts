import Fuse from 'fuse.js';
import { items } from './db';

export const fuzzySearchItemsByName = new Fuse(items.find(), {
  keys: ['name'],
  threshold: 0.4,
  ignoreLocation: true,
  isCaseSensitive: true,
  includeScore: true,
});
