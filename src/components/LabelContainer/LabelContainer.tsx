import { type ReactNode, isValidElement } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib';

interface LabelContainerProps {
  name: string;
  className?: string;
  children?: ReactNode;
}

export const LabelContainer = ({ name, className, children }: LabelContainerProps) => {
  let hasDirectInputElement = false;
  if (isValidElement(children)) {
    hasDirectInputElement = children.type === 'input';
  }

  if (Array.isArray(children)) {
    const isSomeValid = children.some(
      (child) => (isValidElement(child) && child.type === 'input') || child.type.name === 'Controller',
    );
    hasDirectInputElement = isSomeValid;
  }

  // const hasDirectInputElement = isValidElement(children) ? children.type === 'input' : false;
  const Component = hasDirectInputElement ? Label : 'span';
  return (
    <Component className={cn('flex w-full flex-col items-start gap-2', className)}>
      <span className="w-full capitalize">{name}</span>
      {children}
    </Component>
  );
};
