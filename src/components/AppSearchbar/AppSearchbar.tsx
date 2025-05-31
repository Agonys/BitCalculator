import { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useItemContext } from '@/contexts';
import type { Item } from '@/db';
import { getItemSuggestionsByName } from '@/db/functions';
import { useClickOutside } from '@/hooks';
import { debounce } from '@/lib';
import { SearchWithSuggestions } from '../SearchWithSuggestions';
import { SidebarTrigger } from '../ui/sidebar';

export const AppSearchbar = () => {
  const { setSelectedItem } = useItemContext();
  const [suggestions, setSuggestions] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);

  const commandRef = useClickOutside<HTMLDivElement>(() => setOpen(false));

  const debouncedItemLookup = useMemo(
    () =>
      debounce((itemName: string) => {
        if (!itemName.trim()) {
          setOpen(false);
          return;
        }

        const results = getItemSuggestionsByName(itemName);
        setSuggestions(results);
        setOpen(true);
      }, 300),
    [],
  );

  const handleTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    debouncedItemLookup(e.target.value);
  };

  const handleClear = () => {
    debouncedItemLookup('');
    setOpen(false);
  };

  const handleSelect = (item: Item) => {
    setSelectedItem(item);
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div className="bg-sidebar flex w-full items-center gap-2 p-2">
      <SidebarTrigger className="block md:hidden" />
      <SearchWithSuggestions
        isOpen={open}
        onChange={handleTermChange}
        onFocus={handleTermChange}
        onClear={handleClear}
        onSelect={handleSelect}
        onClickOutside={() => setOpen(false)}
        placeholder="Search item..."
        suggestions={suggestions}
        withIcon
        ref={commandRef}
      />
    </div>
  );
};
