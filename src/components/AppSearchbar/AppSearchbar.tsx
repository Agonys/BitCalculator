import { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Search, X } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Input, InputIcon, InputRoot } from '@/components/ui/input';
import { useItemContext } from '@/contexts';
import type { Item } from '@/db';
import { getItemSuggestionsByName } from '@/db/functions';
import { debounce, numberToRoman } from '@/lib';

export const AppSearchbar = () => {
  const { setSelectedItem } = useItemContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);

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
    setSearchTerm(e.target.value);
    debouncedItemLookup(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm('');
    debouncedItemLookup('');
    setOpen(false);
  };

  const handleSelect = (item: Item) => {
    setSelectedItem(item);
    setSuggestions([]);
    setOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="bg-sidebar relative flex w-full justify-center p-2">
      <InputRoot className="w-full max-w-[500px]">
        <InputIcon>
          <Search />
        </InputIcon>
        <Input
          type="text"
          className="pr-10"
          placeholder="Search item..."
          value={searchTerm}
          onChange={handleTermChange}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded p-1 transition"
            tabIndex={-1}
            aria-label="Clear search"
          >
            <X />
          </button>
        )}
      </InputRoot>
      {open && (
        <div className="absolute top-full left-1/2 z-20 -mt-1 w-full max-w-[500px] -translate-x-1/2">
          <Command>
            <CommandList>
              {suggestions.length === 0 ? (
                <CommandEmpty>No items found.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {suggestions.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      onSelect={() => handleSelect(item)}
                      className="flex cursor-pointer items-center gap-3"
                    >
                      {item.icon && <img src={item.icon} alt={item.name} className="h-6 w-6 rounded object-cover" />}
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground ml-auto text-xs">
                        {item.tier && `Tier ${numberToRoman(item.tier)}`}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};
