import {
  type ChangeEvent,
  type ComponentProps,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { type LucideIcon, MousePointerClick, Search, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { Item } from '@/db';
import { getItemById } from '@/db/functions';
import { useClickOutside } from '@/hooks';
import { cn, isSubmitKey, valueClamp } from '@/lib';
import { Separator } from '../ui/separator';
import { ItemTile } from './ItemTile';

interface SearchableItemtile extends Omit<ComponentProps<'input'>, 'onClick' | 'onChange'> {
  suggestions: Item[] | null;
  icon?: LucideIcon;
  text?: string;
  triggerClassName?: string;
  selectedItemId?: string;
  onSelectItem: (item: Item) => void;
  removeSelectedItemId?: () => void;
  onChange: (itemName: string) => void;
}

export const SearchableItemTile = ({
  suggestions,
  selectedItemId,
  triggerClassName,
  icon = MousePointerClick,
  text = 'Click to find item...',
  onSelectItem,
  onChange,
  removeSelectedItemId,
}: SearchableItemtile) => {
  const IconComponent = icon;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [arrowNagivationHintedSuggestionIndex, setArrowNagivationHintedSuggestionIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  //state to track whether or not to display "no suggestions found" to the user.
  const [inputText, setInputText] = useState('');

  const handleItemSelect = useCallback(
    (item: Item) => {
      setIsOpen(false);
      setInputText('');
      onSelectItem(item);
      triggerRef.current?.focus();
    },
    [onSelectItem],
  );

  const changeIsOpen = (state: boolean, e?: KeyboardEvent<HTMLDivElement>) => {
    if (e && !isSubmitKey(e)) return;

    setIsOpen(state);
  };

  const handleRemoveSelectedItem = () => {
    setIsOpen(false);
    removeSelectedItemId?.();
  };

  const handleInputOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    setArrowNagivationHintedSuggestionIndex(0);
    onChange(e.target.value);
  };

  useEffect(() => {
    if (!selectedItemId) return;

    const matchingItem = getItemById(selectedItemId);
    if (!matchingItem) return;

    setSelectedItem(matchingItem);
  }, [selectedItemId]);

  useEffect(() => {
    const handleKeyboardInputs = (e: globalThis.KeyboardEvent) => {
      const { key } = e;

      if (!isOpen) {
        if ((key === 'Delete' || key === 'Backspace') && selectedItemId && removeSelectedItemId) {
          removeSelectedItemId();
          setIsOpen(true);
        }

        return;
      }

      if (key === 'Escape') {
        setIsOpen(false);
        setInputText('');
        return;
      }

      if (['ArrowUp', 'ArrowDown'].includes(key)) {
        if (!suggestions || suggestions.length === 0) return;
        e.preventDefault();

        const directionByArrow = key === 'ArrowUp' ? -1 : 1;
        const suggestionsLength = suggestions.length;

        setArrowNagivationHintedSuggestionIndex((prev) => {
          const newIndex = (prev ?? 0) + directionByArrow;
          return valueClamp(newIndex, 0, suggestionsLength - 1);
        });
        return;
      }

      if (key === 'Enter' && arrowNagivationHintedSuggestionIndex !== null && suggestions) {
        handleItemSelect(suggestions[arrowNagivationHintedSuggestionIndex]);
        return;
      }
    };

    document.addEventListener('keydown', handleKeyboardInputs);
    return () => document.removeEventListener('keydown', handleKeyboardInputs);
  }, [
    isOpen,
    suggestions,
    arrowNagivationHintedSuggestionIndex,
    handleItemSelect,
    selectedItem,
    removeSelectedItemId,
    selectedItemId,
  ]);

  return (
    <Popover open={isOpen} modal={true}>
      <PopoverTrigger asChild className="h-full">
        <div
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            changeIsOpen(!isOpen);
          }}
          tabIndex={0}
          ref={triggerRef}
          onKeyDown={(e) => changeIsOpen(!isOpen, e)}
          data-id="searchable-item-tile"
          className={cn(
            isOpen && 'ring-primary border-primary bg-muted-foreground/10 h-full ring-2 ring-inset',
            'hover:bg-sidebar-accent/30 focus-ring-inset h-full min-w-[300px]',
            triggerClassName,
          )}
        >
          {!selectedItemId ? (
            <div
              className={cn(
                'flex-gap-2 cursor-pointer items-center justify-between rounded-md border p-2',
                'hover:bg-sidebar-accent/30 text-muted-foreground font-medium transition-colors',
              )}
            >
              <span>{text}</span>
              <IconComponent className="" />
            </div>
          ) : (
            <ItemTile item={selectedItem} />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        ref={popoverRef}
        className={cn(
          'w-(--radix-popover-trigger-width) p-0 drop-shadow-2xl/100',
          'data-[side=bottom]:rounded-t-none data-[side=bottom]:border-t-0',
          'data-[side=top]:rounded-b-none data-[side=top]:border-b-0',
          'border-primary border-2',
        )}
        align="start"
        sideOffset={0}
      >
        {isOpen && (
          <div className="flex-col-gap-0">
            <div className="flex-gap-3 text-muted-foreground items-center px-3 py-2">
              <Search />
              <Input
                type="text"
                className="placeholder:text-muted-foreground border-0 p-0 text-white outline-0 focus-visible:border-0 focus-visible:ring-0"
                placeholder="Search item..."
                onChange={handleInputOnChange}
              />
            </div>

            {suggestions && suggestions.length > 0 && <Separator />}

            {suggestions?.map((item, index) => (
              <ItemTile
                key={item.id}
                item={item}
                onClick={handleItemSelect}
                className={cn(
                  arrowNagivationHintedSuggestionIndex === index &&
                    'bg-muted-foreground/10 hover:bg-muted-foreground/10',
                )}
              />
            ))}

            {selectedItemId && (
              <>
                <Separator />
                <div
                  onClick={handleRemoveSelectedItem}
                  className={cn(
                    'flex-gap-3 cursor-pointer items-center justify-center px-3 py-2 select-none',
                    'hover:bg-muted-foreground/10 text-red-700 transition-colors',
                  )}
                >
                  Remove current selection <Trash2 />
                </div>
              </>
            )}

            {inputText.trim().length > 0 && suggestions && suggestions.length === 0 && (
              <div className="flex justify-center border-t p-4 font-normal">No item suggestions found.</div>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
