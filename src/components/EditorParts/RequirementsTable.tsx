import type { KeyboardEvent } from 'react';
import { Trash2 } from 'lucide-react';
import type { Control, UseFieldArrayReturn, UseFormRegister } from 'react-hook-form';
import { TableInput } from '@/components/Inputs';
import type { Item } from '@/db';
import { Table, TableCell, TableHeader, TableRow } from './CustomTable';

// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface RequirementsTableProps {
  itemsArray: UseFieldArrayReturn<Item, 'requirements', 'id'>;
  register: UseFormRegister<Item>;
  control: Control<Item>;
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
      <TableHeader>
        <TableCell>Skill</TableCell>
        <TableCell>Level</TableCell>
        <TableCell />
      </TableHeader>
      {itemsArray.fields.map((field, i) => (
        <TableRow key={field.id}>
          <TableCell>
            <TableInput type="text" placeholder="Skill" {...register(`requirements.${i}.skill` as const)} />
          </TableCell>
          <TableCell>
            <TableInput type="textAsNumber" placeholder="level" {...register(`requirements.${i}.level` as const)} />
          </TableCell>
          <TableCell onClick={() => itemsArray.remove(i)} onKeyDown={(e) => handleKeyboardDelete(e, i)}>
            <Trash2 className="size-4 cursor-pointer text-red-700" />
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
};
