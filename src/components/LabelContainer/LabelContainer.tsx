import type { ReactNode } from 'react';
import { Label } from '../ui/label';

interface LabelContainerProps {
  children?: ReactNode;
  name: string;
}

export const LabelContainer = ({ children, name }: LabelContainerProps) => (
  <Label className="flex w-full flex-col items-start gap-2 capitalize">
    {name}:{children}
  </Label>
);
