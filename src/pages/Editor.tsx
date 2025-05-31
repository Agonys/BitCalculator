import { type ChangeEvent, useMemo, useState } from 'react';
import { PageTitle, SearchWithSuggestions } from '@/components';
import { Card, CardContent } from '@/components/ui/card';
import type { Item } from '@/db';
import { getItemSuggestionsByName } from '@/db/functions';
import { useClickOutside } from '@/hooks';
import { debounce } from '@/lib';
import { Label } from '@radix-ui/react-label';

export const Editor = () => {
  const [suggestions, setSuggestions] = useState<Item[]>([]);
  const [isSuggestionListOpen, setSuggestionListOpen] = useState(false);
  const [isNewItem, setIsNewItem] = useState(false);

  const commandRef = useClickOutside<HTMLDivElement>(() => setSuggestionListOpen(false));

  const debouncedItemLookup = useMemo(
    () =>
      debounce((itemName: string) => {
        if (!itemName.trim()) {
          setSuggestionListOpen(false);
          return;
        }

        const results = getItemSuggestionsByName(itemName);
        setSuggestions(results);
        setSuggestionListOpen(true);
      }, 300),
    [],
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    debouncedItemLookup(e.target.value);
  };

  const handleSelect = (item: Item) => {
    console.log(item);
    handleClear();
  };

  const handleClear = () => {
    debouncedItemLookup('');
    setSuggestionListOpen(false);
  };

  const handleAddNew = () => {
    setIsNewItem(true);
    setSuggestionListOpen(false);
  };

  return (
    <>
      <PageTitle text="Recipe editor tool" description="Add or modify recipes with all possible details" />

      <div className="flex w-full flex-col gap-2">
        <div className="flex w-fit flex-col gap-2">
          <Label>Search item</Label>
          <SearchWithSuggestions
            isOpen={isSuggestionListOpen}
            onChange={handleChange}
            onClickOutside={handleClear}
            onSelect={handleSelect}
            placeholder="search item to modify..."
            suggestions={suggestions}
            withIcon
            onClear={handleClear}
            handleAddNew={handleAddNew}
            ref={commandRef}
          />
        </div>
        {isNewItem && (
          <Card className="border-0">
            <CardContent>something</CardContent>
          </Card>
        )}
      </div>
    </>
  );
};
