import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  onChange?: (value: string | number) => void;
}

interface DropdownPortalProps {
  top: number;
  left: number;
  minWidth: number;
  maxWidth: number;
}

export const InputWithDropdown: React.FC<DropdownProps> = ({
  list,
  placeholder,
  value,
  triggerClassName,
  onChange,
}) => {
  const [open, setOpen] = useState(false); // controls transition state
  const [show, setShow] = useState(false); // controls mounting
  const [search, setSearch] = useState('');
  const [highlighted, setHighlighted] = useState(0);

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const dropdownPortalRef = useRef<HTMLDivElement | null>(null);

  const [dropdownPortalPos, setdropdownPortalPos] = useState<DropdownPortalProps>({
    top: 0,
    left: 0,
    minWidth: 0,
    maxWidth: 0,
  }); // required for creating portal on top of everything

  const containerRef = useClickOutside<HTMLDivElement>(() => {
    closeDropdown();
  }, [triggerRef, dropdownPortalRef]);

  const filtered = list.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));

  const openDropdown = () => {
    setShow(true);
    // Next tick, set open to true to trigger transition
    setTimeout(() => {
      setOpen(true);

      updateDropdownPosition();
    }, 10);
  };

  const closeDropdown = () => {
    setOpen(false);
    setSearch('');
    setHighlighted(0);
    triggerRef.current?.focus();
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
      case 'ArrowDown':
        setHighlighted((h) => valueClamp(h + 1, 0, filtered.length - 1));
        break;
      case 'ArrowUp':
        setHighlighted((h) => Math.max(h - 1, 0));
        break;
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
    setdropdownPortalPos({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      minWidth: rect.width,
      maxWidth: Math.min(rect.width * 2, 500),
    });
  };

  // Unmount after transition
  useEffect(() => {
    if (!open && show) {
      const timeout = setTimeout(() => setShow(false), 150);
      return () => clearTimeout(timeout);
    }
  }, [open, show]);

  // Handle resizing and scrolling window so we can move currently open dropdown.
  useEffect(() => {
    if (!show) return;

    const handle = () => updateDropdownPosition();

    // Listen for scroll and resize
    window.addEventListener('scroll', handle, true);
    window.addEventListener('resize', handle);

    // Listen for trigger resize
    let observer: ResizeObserver | undefined;
    if (triggerRef.current) {
      observer = new window.ResizeObserver(handle);
      observer.observe(triggerRef.current);
    }

    handle();
    return () => {
      window.removeEventListener('scroll', handle, true);
      window.removeEventListener('resize', handle);
      observer?.disconnect();
    };
  }, [show]);

  // Scrolls to highlighted option if selection is off the screen (too far from the top or bottom).
  useEffect(() => {
    if (show && itemRefs.current[highlighted]) {
      itemRefs.current[highlighted]?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlighted, show, filtered.length]);

  // useEffect(() => {

  // }, [show]);

  const selectedLabel = useMemo(() => list.find((item) => item.value === value)?.label || '', [value, list]);

  const dropdownPortalContent = show ? (
    <div
      className={cn(
        'border-input bg-popover absolute right-0 left-0 z-20 mt-1 flex w-min flex-col overflow-hidden rounded-md border text-sm shadow-lg',
        'transform transition-[scale,opacity] duration-150 ease-in-out',
        open ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0',
      )}
      ref={dropdownPortalRef}
      style={{ ...dropdownPortalPos }}
    >
      <div className="flex items-center gap-3 p-3">
        <Search size={16} className="text-muted-foreground shrink-0" />
        <input
          autoFocus
          type="text"
          name="dropdownInput"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            console.log(e);
            setSearch(e.target.value);
            setHighlighted(0);
          }}
          onKeyDown={handleKeyDown}
          className="focus-ring-reset h-min w-full border-0 bg-transparent p-0 text-white"
        />
      </div>
      <Separator />
      <div tabIndex={-1} className="max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto p-1 py-2">
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
          triggerClassName,
        )}
        title={selectedLabel}
        onClick={() => {
          if (!show) openDropdown();
          else closeDropdown();
        }}
        onKeyDown={handleKeyDown}
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
