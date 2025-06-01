import type { KeyboardEvent } from 'react';
import { Trash2 } from 'lucide-react';
import type { Control, UseFieldArrayReturn, UseFormRegister } from 'react-hook-form';
import type { Item } from '@/db';
import { cn } from '@/lib/utils';
import { TableInput } from '../Inputs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface RequirementsTableProps {
  itemsArray: UseFieldArrayReturn<Item, 'requirements', 'id'>;
  register: UseFormRegister<Item>;
  control: Control<Item>;
}
export const RequirementsTable = ({ itemsArray, register, control }: RequirementsTableProps) => {
  const handleKeyboardDelete = (e: KeyboardEvent<SVGSVGElement>, i: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      itemsArray.remove(i);
    }
  };

  const cellStyleByKey = (key: 'skill' | 'level' | 'action') => {
    return cn({
      'max-w-[200px] min-w-[200px]': key === 'skill',
      'max-w-[70px] min-w-[70px]': key === 'level',
      'max-w-8 w-8': key === 'action',
    });
  };

  if (itemsArray.fields.length < 1) return null;
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted hover:bg-muted">
          <TableHead className={cellStyleByKey('skill')}>Skill</TableHead>
          <TableHead className={cellStyleByKey('level')}>Level</TableHead>
          <TableHead className={cellStyleByKey('action')}></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="[&>tr>td:not(:last-child)]:border-r [&>tr>td:not(:last-child):not(:has(button[role=checkbox]))]:p-0">
        {itemsArray.fields.map((field, i) => (
          <TableRow key={field.id}>
            <TableCell className={cellStyleByKey('skill')}>
              <TableInput type="text" placeholder="Skill" {...register(`requirements.${i}.skill` as const)} />
            </TableCell>
            <TableCell className={cellStyleByKey('level')}>
              <TableInput type="textAsNumber" placeholder="level" {...register(`requirements.${i}.level` as const)} />
            </TableCell>
            <TableCell className={cellStyleByKey('action')}>
              <Trash2
                tabIndex={0}
                role="presentation"
                className="size-4 cursor-pointer text-red-700"
                onClick={() => itemsArray.remove(i)}
                onKeyDown={(e) => handleKeyboardDelete(e, i)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
