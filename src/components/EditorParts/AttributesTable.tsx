import type { KeyboardEvent } from 'react';
import { Trash2 } from 'lucide-react';
import { type Control, Controller, type UseFieldArrayReturn, type UseFormRegister } from 'react-hook-form';
import { TableInput } from '@/components/Inputs';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Item } from '@/db';
import { cn } from '@/lib/utils';

interface AttributesTableProps {
  itemsArray: UseFieldArrayReturn<Item, 'attributes', 'id'>;
  register: UseFormRegister<Item>;
  control: Control<Item>;
}
export const AttributesTable = ({ itemsArray, control, register }: AttributesTableProps) => {
  const handleKeyboardDelete = (e: KeyboardEvent<SVGSVGElement>, i: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      itemsArray.remove(i);
    }
  };

  const cellStyleByKey = (key: 'name' | 'min' | 'max' | 'action') => {
    return cn({
      'max-w-[200px]': key === 'name',
      'max-w-[70px]': key === 'min' || key === 'max',
      'max-w-8 w-8': key === 'action',
    });
  };

  if (itemsArray.fields.length < 1) return null;
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted hover:bg-muted">
          <TableHead className={cellStyleByKey('name')}>Name</TableHead>
          <TableHead className={cellStyleByKey('min')}>Min</TableHead>
          <TableHead className={cellStyleByKey('max')}>Max</TableHead>
          <TableHead>%</TableHead>
          <TableHead className={cellStyleByKey('action')}></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="[&>tr>td:not(:last-child)]:border-r [&>tr>td:not(:last-child):not(:has(button[role=checkbox]))]:p-0">
        {itemsArray.fields.map((field, i) => (
          <TableRow key={field.id}>
            <TableCell className={cellStyleByKey('name')}>
              <TableInput type="text" placeholder="Name" {...register(`attributes.${i}.name` as const)} />
            </TableCell>
            <TableCell className={cellStyleByKey('min')}>
              <TableInput type="textAsNumber" placeholder="Min" {...register(`attributes.${i}.valueMin` as const)} />
            </TableCell>
            <TableCell className={cellStyleByKey('max')}>
              <TableInput type="textAsNumber" placeholder="Max" {...register(`attributes.${i}.valueMax` as const)} />
            </TableCell>
            <TableCell className={cn('p-2!', cellStyleByKey('action'))}>
              <Controller
                control={control}
                name={`attributes.${i}.percentage`}
                render={({ field }) => (
                  <Checkbox checked={!!field.value} onCheckedChange={field.onChange} className="cursor-pointer" />
                )}
              />
            </TableCell>
            <TableCell>
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
