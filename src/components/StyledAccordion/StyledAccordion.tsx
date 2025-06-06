import { type ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib';

// interface StyledAccordionProps {
//   name: string;
//   children: ReactNode;
//   className?: string;
//   defaultValue?: string;
// }

// export const StyledAccordion = ({ name, children, className, defaultValue }: StyledAccordionProps) => (
//   <Accordion type="single" collapsible defaultValue={defaultValue} className="w-full">
//     <AccordionItem value={name}>
//       <AccordionTrigger className="hover:bg-background [&[data-state=open]]:bg-background [&[data-state=closed]]:border-b-border hover:border-border flex min-w-[300px] cursor-pointer items-center rounded-b-none border border-transparent capitalize hover:no-underline">
//         {name}
//       </AccordionTrigger>
//       <AccordionContent
//         className={cn('border-border flex flex-col overflow-hidden rounded-b-md border select-none', className)}
//       >
//         {children}
//       </AccordionContent>
//     </AccordionItem>
//   </Accordion>
// );

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
        // className={`flex w-full items-center justify-between rounded-t-md bg-zinc-900 px-4 py-3 text-left font-semibold text-zinc-100 transition-colors duration-200 hover:bg-zinc-800 focus:outline-none`}
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
      <div className={cn('h-0 overflow-hidden transition-all', open && 'h-auto rounded-b-md border')}>
        <div className={className}>{children}</div>
      </div>
    </div>
  );
};
