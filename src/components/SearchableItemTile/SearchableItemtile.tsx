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

interface SearchableItemTileProps extends Omit<ComponentProps<'input'>, 'onClick' | 'onChange'> {
  suggestions: Item[] | null;
  icon?: LucideIcon;
  text?: string;
  triggerClassName?: string;
  selectedItemId?: string;
  onChange: (itemName: string) => void;
  onSelectItem: (item: Item) => void;
  clearSuggestions?: () => void;
  removeSelectedItemId?: () => void;
}

export const SearchableItemTile = ({
  suggestions,
  selectedItemId,
  triggerClassName,
  icon = MousePointerClick,
  text = 'Click to find item...',
  onChange,
  onSelectItem,
  clearSuggestions,
  removeSelectedItemId,
}: SearchableItemTileProps) => {
  const IconComponent = icon;
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [arrowNavigationHintedSuggestionIndex, setArrowNavigationHintedSuggestionIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useClickOutside<HTMLDivElement>(() => {
    if (isOpen) {
      clearSuggestions?.();
      setIsOpen(false);
    }
  }, [triggerRef]);

  const changePopoverContentIsOpen = (state: boolean, e?: KeyboardEvent<HTMLDivElement>) => {
    if (e && !isSubmitKey(e)) return;

    setIsOpen(state);
  };

  const handleItemSelect = useCallback(
    (item: Item) => {
      setIsOpen(false);
      setInputText('');
      onSelectItem(item);
      clearSuggestions?.();
      triggerRef.current?.focus();
    },
    [triggerRef, onSelectItem, clearSuggestions],
  );

  const handleRemoveSelectedItem = () => {
    setIsOpen(false);
    removeSelectedItemId?.();
  };

  const handleInputOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    setArrowNavigationHintedSuggestionIndex(0);
    onChange?.(e.target.value);
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
        // We want to delete current item on shortcut but only for currently selected element
        if (
          (key === 'Delete' || key === 'Backspace') &&
          selectedItemId &&
          removeSelectedItemId &&
          document.activeElement === triggerRef.current
        ) {
          removeSelectedItemId();
          setIsOpen(true);
        }

        return;
      }

      if (key === 'Escape') {
        setIsOpen(false);
        setInputText('');
        clearSuggestions?.();
        return;
      }

      if (['ArrowUp', 'ArrowDown'].includes(key)) {
        if (!suggestions || suggestions.length === 0) return;
        e.preventDefault();

        const directionByArrow = key === 'ArrowUp' ? -1 : 1;
        const suggestionsLength = suggestions.length;

        setArrowNavigationHintedSuggestionIndex((prev) => {
          const newIndex = (prev ?? 0) + directionByArrow;
          return valueClamp(newIndex, 0, suggestionsLength - 1);
        });
        return;
      }

      if (key === 'Enter' && arrowNavigationHintedSuggestionIndex !== null && suggestions) {
        handleItemSelect(suggestions[arrowNavigationHintedSuggestionIndex]);
        return;
      }
    };

    document.addEventListener('keydown', handleKeyboardInputs);
    return () => document.removeEventListener('keydown', handleKeyboardInputs);
  }, [
    isOpen,
    suggestions,
    arrowNavigationHintedSuggestionIndex,
    handleItemSelect,
    selectedItem,
    removeSelectedItemId,
    selectedItemId,
    clearSuggestions,
  ]);

  return (
    <Popover open={isOpen} modal={true}>
      <PopoverTrigger asChild className="h-fit">
        <div
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            changePopoverContentIsOpen(!isOpen);
          }}
          tabIndex={0}
          ref={triggerRef}
          onKeyDown={(e) => changePopoverContentIsOpen(!isOpen, e)}
          data-id="searchable-item-tile"
          className={cn(
            'hover:bg-sidebar-accent/30 focus-ring-inset h-full min-w-[300px] rounded-md border',
            isOpen && 'ring-primary border-primary bg-muted-foreground/10 h-full ring-2 ring-inset',
            triggerClassName,
          )}
        >
          {!selectedItemId ? (
            <div
              className={cn(
                'flex cursor-pointer items-center justify-between gap-2 p-2',
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
          <div className="flex flex-col gap-0">
            <div className="text-muted-foreground flex items-center gap-3 px-3 py-2">
              <Search />
              <Input
                type="text"
                name="popover item search"
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
                  arrowNavigationHintedSuggestionIndex === index &&
                    'bg-muted-foreground/10 hover:bg-muted-foreground/10',
                )}
              />
            ))}

            {inputText.trim().length > 0 && suggestions && suggestions.length === 0 && (
              <div className="flex justify-center border-t p-4 font-normal">No item suggestions found.</div>
            )}

            {selectedItemId && (
              <>
                <Separator />
                <div
                  onClick={handleRemoveSelectedItem}
                  className={cn(
                    'flex cursor-pointer items-center justify-center gap-3 px-3 py-2 select-none',
                    'hover:bg-muted-foreground/10 text-red-700 transition-colors',
                  )}
                >
                  Remove current selection <Trash2 />
                </div>
              </>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
