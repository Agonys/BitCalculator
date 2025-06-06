import { type ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib';

interface StyledAccordionProps {
  name: string;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

export const StyledAccordion = ({ name, children, className = '', defaultOpen = false }: StyledAccordionProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn('w-full rounded-md bg-transparent')}>
      <button
        className={cn(
          'flex w-full min-w-[300px] cursor-pointer items-center justify-between gap-2 rounded-t-md border-b bg-transparent p-2 font-medium transition-colors',
          'hover:bg-background hover:border-border',
          open && 'bg-background',
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        <span className="capitalize">{name}</span>
        <ChevronDown size={20} className={cn('rotate-0 transition-transform', open && 'rotate-180')} />
      </button>
      <div className={cn('max-h-0 overflow-hidden transition-all', open && 'h-auto rounded-b-md border')}>
        <div className={className}>{children}</div>
      </div>
    </div>
  );
};
