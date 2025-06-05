import type { ComponentProps, KeyboardEvent, MouseEvent } from 'react';
import { Plus } from 'lucide-react';
import { isSubmitKey } from '@/lib';
import { cn } from '@/lib/utils';

export const Table = ({ className, children, ...props }: ComponentProps<'div'>) => (
  <div
    role="table"
    className={cn(
      'grid min-h-0 flex-1 items-center justify-center overflow-hidden overflow-y-auto border border-b-0',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export const TableHeader = ({ className, children, ...props }: ComponentProps<'div'>) => (
  <div
    role="columnheader"
    className={cn(
      'bg-muted sticky top-0 z-10 col-span-full grid grid-cols-[inherit] [&>div]:border-r-0 [&>div]:p-2',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export const TableRow = ({ className, children, ...props }: ComponentProps<'div'>) => (
  <div
    role="row"
    className={cn('col-span-full grid grid-cols-[inherit]', 'border-b last:border-b-0', className)}
    {...props}
  >
    {children}
  </div>
);

interface TableCellProps extends ComponentProps<'div'> {
  isHeader?: boolean;
}

export const TableCell = ({ className, children, isHeader, ...props }: TableCellProps) => (
  <div
    {...(props.onClick && { tabIndex: 0 })}
    role={props.onClick ? 'button' : 'cell'}
    className={cn(
      'grid-cell-center h-full items-center border-r border-b last:border-r-0',
      {
        'focus-ring-inset cursor-pointer': props.onClick,
      },
      {
        'bg-muted border-b-muted-foreground/10 sticky top-0 z-10 h-full border-r-0 p-2': isHeader,
      },
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

interface TableAddRowProps extends Omit<ComponentProps<'div'>, 'onClick' | 'onKeyDown'> {
  text?: string;
  onClick: (e?: MouseEvent<HTMLDivElement>) => void;
  onKeyDown?: (e?: KeyboardEvent<HTMLDivElement>) => void;
}

export const TableAddRow = ({ className, onClick, onKeyDown, text = 'Add new' }: TableAddRowProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e && !isSubmitKey(e)) return;

    e.preventDefault();
    onKeyDown?.(e);
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    onClick?.(e);
  };

  return (
    <div
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="presentation"
      className={cn(
        'focus-ring-inset flex-gap-2 w-full cursor-pointer items-center justify-center p-2 transition-colors',
        'text-muted-foreground hover:text-primary focus-visible:text-primary',
        className,
      )}
    >
      <Plus className="size-4" /> {text}
    </div>
  );
};
