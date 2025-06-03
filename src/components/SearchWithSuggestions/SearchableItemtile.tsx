import {
  type ComponentProps,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { type LucideIcon, MousePointerClick, Search, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { Item } from '@/db';
import { getItemById } from '@/db/functions/getItemById';
import { useClickOutside } from '@/hooks';
import { cn, isSubmitKey } from '@/lib';
import { PopoverArrow } from '@radix-ui/react-popover';
import { Separator } from '../ui/separator';
import { ItemTile } from './ItemTile';

interface SearchableItemtile extends Omit<ComponentProps<'input'>, 'onClick'> {
  suggestions: Item[];
  icon?: LucideIcon;
  text?: string;
  triggerClassName?: string;
  selectedItemId?: string;
  onSelectItem: (item: Item) => void;
  removeSelectedItemId: () => void;
}

export const SearchableItemtile = ({
  suggestions,
  onSelectItem,
  onChange,
  selectedItemId,
  removeSelectedItemId,
  icon = MousePointerClick,
  text = 'Click to find item...',
  triggerClassName,
}: SearchableItemtile) => {
  const IconComponent = icon;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handleItemSelect = (item: Item) => {
    setIsOpen(false);
    onSelectItem(item);
  };

  const changeIsOpen = (state: boolean, e?: KeyboardEvent<HTMLDivElement>) => {
    if (e && !isSubmitKey(e)) return;

    setIsOpen(state);
  };

  const handleRemoveSelectedItem = () => {
    setIsOpen(false);
    removeSelectedItemId();
  };

  useEffect(() => {
    if (!selectedItemId) return;

    const matchingItem = getItemById(selectedItemId);
    if (!matchingItem) return;

    setSelectedItem(matchingItem);
  }, [selectedItemId]);

  useEffect(() => {
    const closeOnEsc = (e: globalThis.KeyboardEvent) => {
      const { key } = e;
      if (key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', closeOnEsc);
    return () => document.removeEventListener('keydown', closeOnEsc);
  }, [isOpen]);

  return (
    <Popover open={isOpen}>
      <PopoverTrigger asChild>
        <div
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            changeIsOpen(!isOpen);
          }}
          onKeyDown={(e) => changeIsOpen(!isOpen, e)}
          className={cn(
            isOpen && 'ring-primary border-primary bg-muted-foreground/10 ring-2 ring-inset',
            'hover:bg-sidebar-accent/30',
          )}
        >
          {!selectedItemId ? (
            <div
              tabIndex={0}
              className={cn(
                'flex-gap-2 text-muted-foreground hover:bg-sidebar-accent/30 min-w-[300px] cursor-pointer items-center justify-between rounded-md border p-2 transition-colors',
                'focus-inset-ring',
                triggerClassName,
                // isOpen && 'ring-primary border-primary bg-muted-foreground/10 ring-2 ring-inset', // <-- highlight
              )}
            >
              <span>{text}</span>
              <IconComponent />
            </div>
          ) : (
            <ItemTile item={selectedItem} />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'w-(--radix-popover-trigger-width) p-0 drop-shadow-2xl/100',
          'data-[side=bottom]:rounded-t-none data-[side=bottom]:border-t-0',
          'data-[side=top]:rounded-b-none data-[side=top]:border-b-0',
          'border-primary border-2',
        )}
        align="start"
        sideOffset={0}
      >
        {/* <PopoverArrow className="fill-primary" /> */}
        {isOpen && (
          <div className="flex-col-gap-0">
            <div className="flex-gap-3 text-muted-foreground items-center px-3 py-2">
              <Search />
              <Input
                type="text"
                className="placeholder:text-muted-foreground border-0 p-0 text-white outline-0 focus-visible:border-0 focus-visible:ring-0"
                placeholder="Search item..."
                onChange={(e) => onChange?.(e)}
              />
            </div>

            {suggestions.length > 0 && <Separator />}

            {suggestions.map((item) => (
              <ItemTile key={item.id} item={item} onClick={handleItemSelect} />
            ))}

            {selectedItemId && (
              <>
                <Separator />
                <div
                  onClick={handleRemoveSelectedItem}
                  className={cn(
                    'flex-gap-3 cursor-pointer items-center justify-center px-3 py-2 select-none',
                    'hover:bg-muted-foreground/10 text-red-700',
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
