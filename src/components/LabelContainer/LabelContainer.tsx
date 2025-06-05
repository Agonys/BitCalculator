import { type ReactNode, isValidElement } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib';

interface LabelContainerProps {
  name: string;
  className?: string;
  children?: ReactNode;
}

export const LabelContainer = ({ name, className, children }: LabelContainerProps) => {
  const hasDirectInputElement = isValidElement(children) ? children.type === 'input' : false;
  const Component = hasDirectInputElement ? Label : 'span';
  return (
    <Component className={cn('flex-col-gap-2 w-full items-start', className)}>
      <span className="w-full capitalize">{name}</span>
      {children}
    </Component>
  );
};
