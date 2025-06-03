import { type ComponentProps, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface TableInputProps extends ComponentProps<'input'> {
  type: 'text' | 'textAsNumber' | 'number';
}
export const TableInput = ({ className, type, ...props }: TableInputProps) => {
  const typeSpecificProps = useMemo<Partial<ComponentProps<'input'>>>(() => {
    if (type === 'textAsNumber')
      return {
        pattern: `^-?\\d*\\.?\\d*$`,
        inputMode: 'decimal',
      };

    return {};
  }, [type]);

  return (
    <input
      type="text"
      placeholder={props.placeholder}
      {...typeSpecificProps}
      {...props}
      className={cn('w-full p-2 outline-0', 'focus-inset-ring', 'placeholder:text-muted-foreground/45', className)}
    />
  );
};
