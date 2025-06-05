import { Fragment, type KeyboardEvent } from 'react';
import { Trash2 } from 'lucide-react';
import type { Control, UseFieldArrayReturn, UseFormRegister } from 'react-hook-form';
import { TableInput } from '@/components/Inputs';
import type { ItemForm } from '@/db';
import { Table, TableCell } from './CustomTable';

interface RequirementsTableProps {
  itemsArray: UseFieldArrayReturn<ItemForm, 'requirements', 'id'>;
  register: UseFormRegister<ItemForm>;
  control: Control<ItemForm>;
}
export const RequirementsTable = ({ itemsArray, register }: RequirementsTableProps) => {
  const handleKeyboardDelete = (e: KeyboardEvent<HTMLDivElement>, i: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      itemsArray.remove(i);
    }
  };

  if (itemsArray.fields.length < 1) return null;

  return (
    <Table className="grid-cols-[1fr_100px_--spacing(8)]">
      <TableCell isHeader>Skill</TableCell>
      <TableCell isHeader>Level</TableCell>
      <TableCell isHeader />
      {itemsArray.fields.map((field, i) => (
        <Fragment key={field.id}>
          <TableCell>
            <TableInput type="text" placeholder="Skill" {...register(`requirements.${i}.skill` as const)} />
          </TableCell>
          <TableCell>
            <TableInput type="textAsNumber" placeholder="level" {...register(`requirements.${i}.level` as const)} />
          </TableCell>
          <TableCell onClick={() => itemsArray.remove(i)} onKeyDown={(e) => handleKeyboardDelete(e, i)}>
            <Trash2 className="size-4 cursor-pointer text-red-700" />
          </TableCell>
        </Fragment>
      ))}
    </Table>
  );
};
