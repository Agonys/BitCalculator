// db.ts
import Loki from 'lokijs';
import type { Item } from '@/db';
import { mockData } from './mockData';

export const db = new Loki('game.db');

export const items = db.addCollection<Item>('items', { unique: ['id'] });

items.insert(mockData);
