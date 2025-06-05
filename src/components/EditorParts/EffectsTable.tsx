import { Fragment } from 'react';
import type { KeyboardEvent } from 'react';
import { Trash2 } from 'lucide-react';
import type { Control, UseFieldArrayReturn, UseFormRegister } from 'react-hook-form';
import type { Item, ItemForm } from '@/db';
import { cn, isSubmitKey } from '@/lib';
import { TableInput } from '../Inputs';
import { Table, TableAddRow, TableCell } from './CustomTable';

interface EffectsTableProps {
  itemsArray: UseFieldArrayReturn<ItemForm, 'effects', 'id'>;
  register: UseFormRegister<ItemForm>;
  control: Control<ItemForm>;
}

export const EffectsTable = ({ itemsArray, register }: EffectsTableProps) => {
  const handleRemoveEffect = (effectIndex: number, e?: KeyboardEvent<HTMLDivElement>) => {
    if (e && !isSubmitKey(e)) return;

    e?.preventDefault();
    itemsArray.remove(effectIndex);
  };

  const handleAddAttribute = (effectIndex: number, e?: KeyboardEvent<HTMLDivElement>) => {
    if (e && !isSubmitKey(e)) return;

    const currentEffect = itemsArray.fields[effectIndex];

    itemsArray.update(effectIndex, {
      ...currentEffect,
      attributes: [...currentEffect.attributes, { name: '', timeUnit: '', value: '' }],
    });
  };

  const handleRemoveAttribute = (effectIndex: number, attrIndex: number, e?: KeyboardEvent<HTMLDivElement>) => {
    if (e && !isSubmitKey(e)) return;

    const currentEffect = itemsArray.fields[effectIndex];

    if (currentEffect.attributes.length === 1) return;

    itemsArray.update(effectIndex, {
      ...currentEffect,
      attributes: currentEffect.attributes.filter((_, i) => i !== attrIndex),
    });
  };

  if (itemsArray.fields.length < 1) return null;

  return (
    <Table className="grid-cols-[--spacing(8)_1fr_100px_100px_--spacing(8)]">
      <TableCell isHeader className="col-span-2">
        Effect / Attribute Name
      </TableCell>
      <TableCell isHeader>Value</TableCell>
      <TableCell isHeader>Unit</TableCell>
      <TableCell isHeader />

      {itemsArray.fields.map((field, i) => {
        return (
          <Fragment key={field.id}>
            {i !== 0 && <TableCell className="bg-border col-span-5 h-2 border-0"></TableCell>}
            <TableCell className="col-span-4">
              <TableInput type="text" placeholder="Effect name" {...register(`effects.${i}.name` as const)} />
            </TableCell>
            <TableCell
              onClick={() => handleRemoveEffect(i)}
              onKeyDown={(e) => handleRemoveEffect(i, e)}
              tabIndex={0}
              className="cursor-pointer border-r-0 text-red-700"
            >
              <Trash2 className="size-4" />
            </TableCell>

            {field.attributes.map((_, j) => (
              <Fragment key={`${field.id}-${j}`}>
                <TableCell>
                  <div className="bg-muted-foreground h-full w-0.5 justify-self-center"></div>
                </TableCell>
                <TableCell>
                  <TableInput
                    type="text"
                    placeholder="Attribute name"
                    {...register(`effects.${i}.attributes.${j}.name` as const)}
                  />
                </TableCell>
                <TableCell>
                  <TableInput
                    type="number"
                    placeholder="Value"
                    {...register(`effects.${i}.attributes.${j}.value` as const)}
                  />
                </TableCell>
                <TableCell>
                  <TableInput
                    type="text"
                    placeholder="Unit"
                    {...register(`effects.${i}.attributes.${j}.timeUnit` as const)}
                  />
                </TableCell>
                <TableCell
                  tabIndex={0}
                  title={field.attributes.length <= 1 ? 'At least 1 entry required' : ''}
                  onClick={() => handleRemoveAttribute(i, j)}
                  onKeyDown={(e) => handleRemoveAttribute(i, j, e)}
                  className={cn('cursor-pointer border-r-0 text-red-700', {
                    'cursor-not-allowed text-neutral-600': field.attributes.length <= 1,
                  })}
                >
                  <Trash2 className="size-4" />
                </TableCell>
              </Fragment>
            ))}

            <TableCell>
              <div className="bg-muted-foreground h-1/2 w-0.5 justify-self-center"></div>
              <div className="bg-muted-foreground h-0.5 w-1/2 translate-x-6/12 justify-self-center"></div>
            </TableCell>
            <TableCell className="col-span-4 border-r-0">
              <TableAddRow
                className="col-span-4 border-t-0"
                text="Add new effect attribute"
                onClick={() => handleAddAttribute(i)}
                onKeyDown={(e) => handleAddAttribute(i, e)}
              />
            </TableCell>
          </Fragment>
        );
      })}
    </Table>
  );
};
