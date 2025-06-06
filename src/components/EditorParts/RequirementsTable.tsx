import { Fragment, type KeyboardEvent } from 'react';
import { Trash2 } from 'lucide-react';
import {
  type Control,
  Controller,
  type FieldErrors,
  type UseFieldArrayReturn,
  type UseFormRegister,
} from 'react-hook-form';
import { TableInput } from '@/components/Inputs';
import type { ItemForm } from '@/db';
import { Table, TableCell } from './CustomTable';

interface RequirementsTableProps {
  itemsArray: UseFieldArrayReturn<ItemForm, 'requirements', 'id'>;
  control: Control<ItemForm>;
  errors: FieldErrors<ItemForm>;
}
export const RequirementsTable = ({ itemsArray, control, errors }: RequirementsTableProps) => {
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
            <Controller
              control={control}
              name={`requirements.${i}.skill`}
              render={({ field }) => (
                <TableInput
                  type="text"
                  placeholder="Skill"
                  {...field}
                  error={errors.requirements?.[i]?.skill?.message}
                />
              )}
            />
          </TableCell>
          <TableCell>
            <Controller
              control={control}
              name={`requirements.${i}.level`}
              rules={{
                required:
                  'Level of requirement is required. Name could be empty (level requirement applied to anything)',
              }}
              render={({ field }) => (
                <TableInput
                  type="textAsNumber"
                  placeholder="Level"
                  {...field}
                  error={errors.requirements?.[i]?.level?.message}
                />
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
