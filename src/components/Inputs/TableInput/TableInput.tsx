import { type ComponentProps, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface TableInputProps extends ComponentProps<'input'> {
  type: 'text' | 'textAsNumber' | 'number';
  error?: string;
}
export const TableInput = ({ className, type, error, ...props }: TableInputProps) => {
  const typeSpecificProps = useMemo<Partial<ComponentProps<'input'>>>(() => {
    if (type === 'textAsNumber')
      return {
        pattern: `^-?\\d*\\.?\\d*$`,
        inputMode: 'decimal',
        type: 'text',
      };

    if (type === 'number') {
      return {
        min: 1,
        type,
      };
    }

    return {
      type,
    };
  }, [type]);

  return (
    <input
      placeholder={props.placeholder}
      {...props}
      {...typeSpecificProps}
      title={error}
      className={cn(
        'w-full p-2 outline-0',
        'focus-ring-inset placeholder:text-muted-foreground/45',
        error && 'focus-ring-inset-destructive ring-destructive ring-1 ring-inset',
        className,
      )}
    />
  );
};
