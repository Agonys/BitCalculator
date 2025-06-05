import { useMemo, useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useItemContext } from '@/contexts';
import type { Item } from '@/db';
import { getItemSuggestionsByName } from '@/db/functions';
import { debounce } from '@/lib';
import { SearchableItemTile } from '../SearchableItemTile';

export const AppSearchbar = () => {
  const { setSelectedItem } = useItemContext();
  const [suggestions, setSuggestions] = useState<Item[] | null>(null);

  const debouncedItemLookup = useMemo(
    () =>
      debounce((itemName: string) => {
        if (!itemName.trim()) {
          setSuggestions(null);
          return;
        }

        const results = getItemSuggestionsByName(itemName);
        setSuggestions(results);
      }, 300),
    [],
  );

  const handleSelectItem = (item: Item) => {
    // TODO: Add action dialog to confirm redirection if on editor page with some data already in-progress so user is aware of possible data loss.
    setSelectedItem(item);
    setSuggestions(null);
  };

  return (
    <div className="bg-sidebar flex w-full items-center justify-center gap-2 p-2">
      <SidebarTrigger className="block md:hidden" />
      <SearchableItemTile
        onSelectItem={handleSelectItem}
        suggestions={suggestions}
        onChange={debouncedItemLookup}
        triggerClassName="min-w-[300px] md:min-w-[400px] lg:min-w-[600px] xl:min-w-[700px]"
      />
    </div>
  );
};
