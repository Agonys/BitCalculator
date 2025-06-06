import React, { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Separator } from '@/components/ui/separator';
import { useClickOutside } from '@/hooks';
import { cn, valueClamp } from '@/lib';

interface Option {
  label: string;
  value: string | number;
}

interface DropdownProps {
  list: Option[];
  placeholder: string;
  value?: string | number;
  triggerClassName?: string;
  hasError?: boolean;
  disabled?: boolean;
  onChange?: (value: string | number) => void;
}

type PortalCSSProps = CSSProperties & Record<string, string | number>;

export const InputWithDropdown = ({
  list,
  placeholder,
  value,
  triggerClassName,
  hasError,
  disabled,
  onChange,
}: DropdownProps) => {
  const [open, setOpen] = useState(false); // controls transition state
  const [show, setShow] = useState(false); // controls mounting
  const [search, setSearch] = useState('');
  const [highlighted, setHighlighted] = useState(0);

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownPortalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [dropdownPortalPos, setdropdownPortalPos] = useState<PortalCSSProps>({
    top: 0,
    left: 0,
    transform: '',
    minWidth: 0,
    maxWidth: 0,
    transformOrigin: '',
  }); // required for creating portal on top of everything

  const containerRef = useClickOutside<HTMLDivElement>(() => {
    if (open) {
      closeDropdown();
    }
  }, [triggerRef, dropdownPortalRef]);

  const filtered = list.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));

  const openDropdown = () => {
    updateDropdownPosition();
    setShow(true);
    // Next tick, set open to true to trigger transition
    setTimeout(() => {
      setOpen(true);
    }, 10);
  };

  const closeDropdown = () => {
    setOpen(false);
    setSearch('');
    setHighlighted(0);
    // triggerRef.current?.focus();
  };

  const scrollToHighlighted = (highlightedIndex: number) => {
    if (!itemRefs.current) return;

    itemRefs.current[highlightedIndex]?.scrollIntoView({ block: 'nearest' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const { key } = e;
    if (!show) {
      if (key === 'Backspace' && value) {
        onChange?.('');
        openDropdown();
      }

      if (key.length !== 1 && !['ArrowDown', 'Enter', ' '].includes(key)) return;

      openDropdown();
      return;
    }

    switch (key) {
      case 'ArrowDown': {
        const highlightedIndex = valueClamp(highlighted + 1, 0, filtered.length - 1);
        setHighlighted(highlightedIndex);
        scrollToHighlighted(highlightedIndex);
        break;
      }
      case 'ArrowUp': {
        const highlightedIndex = Math.max(highlighted - 1, 0);
        setHighlighted(highlightedIndex);
        scrollToHighlighted(highlightedIndex);
        break;
      }
      case 'Enter':
        if (!filtered[highlighted]) return;
        handleSelect(filtered[highlighted].value);
        break;
      case 'Escape':
        closeDropdown();
        break;
      case 'Tab':
        e.preventDefault();
        break;
      case 'Delete': {
        if (!value) return;

        onChange?.('');
        break;
      }
      default:
        break;
    }
  };

  const handleSelect = (newValue: string | number) => {
    const finalValue = value === newValue ? '' : newValue;

    onChange?.(finalValue);
    closeDropdown();
  };

  const updateDropdownPosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const margin = 4;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownHeight = dropdownPortalRef.current?.clientHeight || 0;

    let openUpwards = false;
    if (dropdownHeight > spaceBelow && spaceAbove > spaceBelow) {
      openUpwards = true;
    }

    const translateYPos = openUpwards ? rect.top - dropdownHeight - margin : rect.top + rect.height + margin;

    if (dropdownPortalRef.current) {
      dropdownPortalRef.current.dataset['openDirection'] = openUpwards ? 'up' : 'down';
    }

    setdropdownPortalPos({
      '--dropdown-input-root-width': rect.width + 'px',
      '--dropdown-input-root-height': rect.height + 'px',
      '--dropdown-input-root-top': rect.top + 'px',
      '--dropdown-input-root-left': rect.left + 'px',
      transform: `translate(${rect.left}px, ${translateYPos}px)`,
    });
  };

  // Unmount after transition
  useEffect(() => {
    if (open && show) {
      searchInputRef.current?.focus();
    }

    if (!open && show) {
      const timeout = setTimeout(() => setShow(false), 150);
      return () => clearTimeout(timeout);
    }
  }, [open, show]);

  // Handle resizing and scrolling window so we can move currently open dropdown.
  useEffect(() => {
    if (!show) return;

    window.addEventListener('scroll', updateDropdownPosition, true);
    window.addEventListener('resize', updateDropdownPosition);

    let observer: ResizeObserver | undefined;
    if (triggerRef.current) {
      observer = new window.ResizeObserver(updateDropdownPosition);
      observer.observe(triggerRef.current);
    }

    updateDropdownPosition();
    return () => {
      window.removeEventListener('scroll', updateDropdownPosition, true);
      window.removeEventListener('resize', updateDropdownPosition);
      observer?.disconnect();
    };
  }, [show]);

  // Scrolls to highlighted option if selection is off the screen (too far from the top or bottom).
  useEffect(() => {
    if (show && open && itemRefs.current[highlighted]) {
      itemRefs.current[highlighted]?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlighted, show, filtered.length, open]);

  const selectedLabel = useMemo(() => list.find((item) => item.value === value)?.label || '', [value, list]);

  const dropdownPortalContent = show ? (
    <div
      style={{ ...dropdownPortalPos }}
      className={cn(
        'fixed top-0 left-0 z-20 min-w-max text-sm',
        'animate-(--animate-enter) transition-[opacity] ease-in-out',
        'pointer-events-none opacity-0',
        open && 'pointer-events-auto opacity-100',
      )}
      ref={dropdownPortalRef}
    >
      <div
        className={cn(
          'border-input bg-popover flex w-min min-w-(--dropdown-input-root-width) flex-col overflow-hidden rounded-md border shadow-lg transition-[scale] ease-in-out',
          open ? 'scale-100' : 'scale-95',
        )}
      >
        <div className="flex items-center gap-3 p-3">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            name="dropdownInput"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setHighlighted(0);
            }}
            onKeyDown={handleKeyDown}
            className="focus-ring-reset h-min w-full border-0 bg-transparent p-0 text-white"
          />
        </div>
        <Separator />
        <div
          tabIndex={-1}
          className="max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto p-1 py-2"
          role="combobox"
          id="dropdown-listbox"
        >
          {filtered.length === 0 && <div className="text-muted-foreground px-3 py-2 select-none">No option found.</div>}
          {filtered.map((item, i) => (
            <div
              key={item.value}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              role="option"
              title={item.label}
              aria-selected={value === item.value}
              id={`option-${item.value}`}
              aria-posinset={i + 1}
              aria-setsize={filtered.length}
              onMouseDown={() => handleSelect(item.value)}
              onMouseEnter={() => setHighlighted(i)}
              className={cn(
                `hover:bg-accent flex h-fit cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2`,
                highlighted === i && 'bg-accent',
              )}
            >
              <span className="line-clamp-2">{item.label}</span>
              {value === item.value && (
                <span className="text-muted-foreground">
                  <Check size={16} />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        tabIndex={0}
        ref={triggerRef}
        className={cn(
          'flex h-9 w-auto max-w-[300px] min-w-[130px] gap-2 px-3 py-1',
          'cursor-pointer items-center justify-between rounded-md border',
          'truncate overflow-hidden whitespace-nowrap',
          'focus-ring-inset border-input hover:bg-accent text-muted-foreground text-sm transition-[background-color,border-color]',
          selectedLabel && 'text-white',
          hasError && 'ring-destructive ring-2 ring-inset',
          disabled && 'text-muted-foreground cursor-not-allowed opacity-50 hover:bg-transparent',
          triggerClassName,
        )}
        role="combobox"
        aria-controls="dropdown-listbox"
        aria-activedescendant={show && filtered[highlighted] ? `option-${filtered[highlighted].value}` : undefined}
        title={selectedLabel}
        onClick={() => {
          if (disabled) return;

          if (!show) openDropdown();
          else closeDropdown();
        }}
        onKeyDown={(e) => {
          if (disabled) return;

          handleKeyDown(e);
        }}
        aria-haspopup="listbox"
        aria-expanded={show}
      >
        <span className="truncate">{selectedLabel || placeholder}</span>
        <ChevronsUpDown size={16} className="text-muted-foreground shrink-0" />
      </div>

      {createPortal(dropdownPortalContent, document.body)}
    </div>
  );
};
