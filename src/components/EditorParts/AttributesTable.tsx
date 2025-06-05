import { Fragment, type KeyboardEvent } from 'react';
import { Trash2 } from 'lucide-react';
import type { Control, UseFieldArrayReturn, UseFormRegister } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Table, TableCell } from '@/components/EditorParts/CustomTable';
import { TableInput } from '@/components/Inputs';
import { Checkbox } from '@/components/ui/checkbox';
import type { ItemForm } from '@/db';

interface AttributesTableProps {
  itemsArray: UseFieldArrayReturn<ItemForm, 'attributes', 'id'>;
  register: UseFormRegister<ItemForm>;
  control: Control<ItemForm>;
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
    <Table className="grid-cols-[1fr_70px_70px_--spacing(8)_--spacing(8)]">
      <TableCell isHeader>Name</TableCell>
      <TableCell isHeader>Min</TableCell>
      <TableCell isHeader>Max</TableCell>
      <TableCell isHeader>%</TableCell>
      <TableCell isHeader />
      {itemsArray.fields.map((field, i) => (
        <Fragment key={field.id}>
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
        </Fragment>
      ))}
    </Table>
  );
};
