import * as React from 'react';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

export type InputRootProps = React.ComponentProps<'div'>;

function InputRoot({ children, className, ...props }: InputRootProps) {
  return (
    <div className={cn('relative flex gap-2', className)} {...props}>
      {children}
    </div>
  );
}

function InputIcon({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Slot
      role="presentation"
      className={cn('pointer-events-none absolute top-2 bottom-2 left-3 size-5 [&~input]:pl-11', className)}
    >
      {children}
    </Slot>
  );
}

const inputVariants = cva(
  'flex h-9 w-full rounded-md bg-transparent border px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-light focus-ring-inset',
  {
    variants: {
      variant: {
        default: 'border-input shadow-xs',
        destructive: 'focus-ring-inset-destructive',
        ghost: 'border-transparent -mx-3 -my-1',
        error: 'ring-destructive ring-2 ring-inset',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface InputProps extends React.ComponentProps<'input'>, VariantProps<typeof inputVariants> {
  ref?: React.ForwardedRef<HTMLInputElement>;
}

function Input({ className, type, ref, variant, ...props }: InputProps) {
  return <input type={type} className={cn(inputVariants({ variant }), className)} ref={ref} {...props} />;
}

export { Input, InputIcon, InputRoot, inputVariants };
