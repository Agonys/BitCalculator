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
      className={cn('w-full p-2 outline-0 focus-visible:shadow-[inset_0_0_0_1px_var(--muted-foreground)]', className)}
    />
  );
};
