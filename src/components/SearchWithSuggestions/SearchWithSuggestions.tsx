import { useRef, useState } from 'react';
import type { ChangeEvent, Dispatch, ReactNode, RefObject, SetStateAction, SyntheticEvent } from 'react';
import { PlusCircle, Search, X } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import type { Item } from '@/db';
import { useClickOutside } from '@/hooks';
import { numberToRoman } from '@/lib';
import { Input, InputIcon, InputRoot } from '../ui/input';
import { Separator } from '../ui/separator';

interface SearchWithSuggestionsProps {
  placeholder: string;
  isOpen: boolean;
  suggestions: Item[];
  withIcon?: boolean;
  icon?: ReactNode;
  ref?: RefObject<HTMLDivElement | null>;
  inputValue?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSelect: (item: Item) => void;
  onFocus?: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  onClickOutside?: () => void;
  handleAddNew?: () => void;
}

export const SearchWithSuggestions = ({
  placeholder,
  isOpen,
  suggestions,
  withIcon,
  icon,
  ref,
  inputValue,
  onChange,
  onFocus,
  onClear,
  onSelect,
  handleAddNew,
}: SearchWithSuggestionsProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchTerm, setSearchTerm] = useState(inputValue ?? '');

  const handleTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onChange(e);
  };

  const handleFocus = (e: ChangeEvent<HTMLInputElement>) => {
    onFocus?.(e);
  };

  const handleClear = () => {
    setSearchTerm('');
    onClear?.();
  };

  const handleSelect = (item: Item) => {
    if (inputValue) {
      handleTermChange({ target: { value: item.id } } as ChangeEvent<HTMLInputElement>);
    } else {
      setSearchTerm('');
    }
    onSelect(item);
  };

  return (
    <div className="relative flex w-full justify-center">
      <InputRoot className="w-full max-w-[500px]">
        {withIcon && <InputIcon>{icon ? icon : <Search />}</InputIcon>}
        <Input
          type="text"
          className="pr-10"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleTermChange}
          onFocus={handleFocus}
          ref={inputRef}
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
      {isOpen && (
        <div className="absolute top-full left-1/2 z-20 -mt-1 w-full max-w-[500px] -translate-x-1/2">
          <Command ref={ref} className="border-border border text-sm">
            <CommandList>
              {suggestions.length === 0 ? (
                <CommandGroup>
                  <CommandItem className="h-20 justify-center">No items found.</CommandItem>
                  {handleAddNew && (
                    <>
                      <Separator className="my-1" />
                      <CommandItem data-test-id="xd" className="cursor-pointer" onSelect={handleAddNew}>
                        <PlusCircle /> Add new
                      </CommandItem>
                    </>
                  )}
                </CommandGroup>
              ) : (
                <CommandGroup>
                  {suggestions.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      onSelect={() => handleSelect(item)}
                      className="flex cursor-pointer items-center gap-3"
                    >
                      {item.icon && (
                        <img src={item.icon} alt={item.name} className="h-10 w-10 rounded object-contain" />
                      )}
                      <div className="flex-col-gap-2">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-muted-foreground text-xs">
                          {item.tier && `Tier ${numberToRoman(item.tier)}`}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                  {handleAddNew && (
                    <>
                      <Separator className="my-1" />
                      <CommandItem className="cursor-pointer" onClick={handleAddNew}>
                        <PlusCircle /> Add new
                      </CommandItem>
                    </>
                  )}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};
