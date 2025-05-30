import { createContext, useContext, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { Item } from '@/db';

interface ItemsProviderProps {
  children: ReactNode;
}

interface AddItemToListProps {
  item: Item;
  quantity: number;
}

interface RemoveItemFromListProps {
  item: Item;
}

interface ItemsContextProps {
  selectedItem: Item | null;
  itemsOnList: Record<Item['id'], number>;
  setSelectedItem: Dispatch<SetStateAction<Item | null>>;
  addItemToList: (props: AddItemToListProps) => void;
  removeItemFromList: (props: RemoveItemFromListProps) => void;
  clearList: () => void;
}

const initialItemsContext: ItemsContextProps = {
  itemsOnList: {},
  selectedItem: null,
  setSelectedItem: () => {},
  addItemToList: () => {},
  removeItemFromList: () => {},
  clearList: () => {},
};

const ItemsContext = createContext<ItemsContextProps>(initialItemsContext);

export const ItemsProvider = ({ children }: ItemsProviderProps) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [itemsOnList, setItemsOnList] = useState<ItemsContextProps['itemsOnList']>({});

  const addItemToList = ({ item, quantity }: AddItemToListProps) => {
    setItemsOnList((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] ?? 0) + quantity,
    }));
  };

  const removeItemFromList = ({ item }: RemoveItemFromListProps) => {
    setItemsOnList((prev) => {
      const { [item.id]: _, ...rest } = prev;
      return rest;
    });
  };

  const clearList = () => setItemsOnList({});

  return (
    <ItemsContext.Provider
      value={{ selectedItem, itemsOnList, setSelectedItem, addItemToList, removeItemFromList, clearList }}
    >
      {children}
    </ItemsContext.Provider>
  );
};

export const useItemContext = () => useContext(ItemsContext);
