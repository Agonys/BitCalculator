import type { KeyboardEvent } from 'react';
import { Trash2 } from 'lucide-react';
import type { Control, UseFieldArrayReturn, UseFormRegister } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Table, TableCell, TableHeader, TableRow } from '@/components/EditorParts/CustomTable';
import { TableInput } from '@/components/Inputs';
import { Checkbox } from '@/components/ui/checkbox';
import type { Item } from '@/db';

interface AttributesTableProps {
  itemsArray: UseFieldArrayReturn<Item, 'attributes', 'id'>;
  register: UseFormRegister<Item>;
  control: Control<Item>;
}

export const AttributesTable = ({ itemsArray, control, register }: AttributesTableProps) => {
  const handleKeyboardDelete = (e: KeyboardEvent<HTMLDivElement>, i: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      itemsArray.remove(i);
    }
  };

  if (itemsArray.fields.length < 1) return null;

  return (
    <Table className="grid-cols-[200px_70px_70px_1fr_--spacing(8)]">
      <TableHeader>
        <TableCell>Name</TableCell>
        <TableCell>Min</TableCell>
        <TableCell>Max</TableCell>
        <TableCell>%</TableCell>
        <TableCell />
      </TableHeader>
      {itemsArray.fields.map((field, i) => (
        <TableRow key={field.id}>
          <TableCell>
            <TableInput type="text" placeholder="Name" {...register(`attributes.${i}.name` as const)} />
          </TableCell>
          <TableCell>
            <TableInput type="textAsNumber" placeholder="Min" {...register(`attributes.${i}.valueMin` as const)} />
          </TableCell>
          <TableCell>
            <TableInput type="textAsNumber" placeholder="Max" {...register(`attributes.${i}.valueMax` as const)} />
          </TableCell>
          <TableCell className="p-2">
            <Controller
              control={control}
              name={`attributes.${i}.percentage`}
              render={({ field }) => (
                <Checkbox checked={!!field.value} onCheckedChange={field.onChange} className="cursor-pointer" />
              )}
            />
          </TableCell>
          <TableCell onClick={() => itemsArray.remove(i)} onKeyDown={(e) => handleKeyboardDelete(e, i)}>
            <Trash2 className="size-4 cursor-pointer text-red-700" />
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
};
