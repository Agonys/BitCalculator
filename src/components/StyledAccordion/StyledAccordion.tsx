import type { ReactNode } from 'react';
import { cn } from '@/lib';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

interface StyledAccordionProps {
  name: string;
  children: ReactNode;
  className?: string;
  defaultValue?: string;
}

export const StyledAccordion = ({ name, children, className, defaultValue }: StyledAccordionProps) => (
  <Accordion type="single" collapsible defaultValue={defaultValue} className="w-full">
    <AccordionItem value={name}>
      <AccordionTrigger className="hover:bg-background [&[data-state=open]]:bg-background [&[data-state=closed]]:border-b-border hover:border-border flex min-w-[300px] cursor-pointer items-center rounded-b-none border border-transparent capitalize hover:no-underline">
        {name}
      </AccordionTrigger>
      <AccordionContent
        className={cn('border-border flex flex-col overflow-hidden rounded-b-md border select-none', className)}
      >
        {children}
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);
