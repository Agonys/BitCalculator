import Fuse from 'fuse.js';
import { items } from './db';

export const fuse = new Fuse(items.find(), {
  keys: ['name'],
  threshold: 0.3,
  ignoreLocation: true,
  isCaseSensitive: true,
  includeScore: true,
});
