// db.ts
import Loki from 'lokijs';
import { mockData } from './mockData';
import type { Item } from './types';

// 1. Create the database
export const db = new Loki('game.db');

// 2. Add a collection for items
export const items = db.addCollection<Item>('items', { unique: ['id'] });

// 3. Insert items into the collection
items.insert(mockData);
