import { Fragment } from 'react';
import type { KeyboardEvent } from 'react';
import { Trash2 } from 'lucide-react';
import type { Control, UseFieldArrayReturn, UseFormRegister } from 'react-hook-form';
import type { Item } from '@/db';
import { isSubmitKey } from '@/lib';
import { cn } from '@/lib/utils';
import { TableInput } from '../Inputs';
import { Table, TableAddRow, TableCell, TableHeader, TableRow } from './CustomTable';

interface EffectsTableProps {
  itemsArray: UseFieldArrayReturn<Item, 'effects', 'id'>;
  register: UseFormRegister<Item>;
  control: Control<Item>;
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

    if (currentEffect.attributes.length === 1) {
      itemsArray.remove(effectIndex);
    } else {
      itemsArray.update(effectIndex, {
        ...currentEffect,
        attributes: currentEffect.attributes.filter((_, i) => i !== attrIndex),
      });
    }
  };

  if (itemsArray.fields.length < 1) return null;

  return (
    <Table className="grid-cols-[--spacing(8)_1fr_100px_100px_--spacing(8)]">
      <TableHeader>
        <TableCell className="col-span-2">Effect / Attribute Name</TableCell>
        <TableCell>Value</TableCell>
        <TableCell>Unit</TableCell>
        <TableCell />
      </TableHeader>

      {itemsArray.fields.map((field, i) => {
        return (
          <Fragment key={field.id}>
            <TableRow className={cn(i !== 0 && 'border-t-3')}>
              <TableCell className="col-span-4">
                <TableInput type="text" placeholder="Effect name" {...register(`effects.${i}.name` as const)} />
              </TableCell>
              <TableCell onClick={() => handleRemoveEffect(i)} onKeyDown={(e) => handleRemoveEffect(i, e)} tabIndex={0}>
                <Trash2 className="size-4 cursor-pointer text-red-700" />
              </TableCell>
            </TableRow>

            {field.attributes.map((_, j) => (
              <TableRow key={`${field.id}-${j}`}>
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
                  onClick={() => handleRemoveAttribute(i, j)}
                  onKeyDown={(e) => handleRemoveAttribute(i, j, e)}
                >
                  <Trash2 className="size-4 cursor-pointer text-red-700" />
                </TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell>
                <div className="bg-muted-foreground h-1/2 w-0.5 justify-self-center"></div>
                <div className="bg-muted-foreground h-0.5 w-1/2 translate-x-6/12 justify-self-center"></div>
              </TableCell>
              <TableCell className="col-span-4">
                <TableAddRow
                  className="border-t-0"
                  text="Add new effect attribute"
                  onClick={() => handleAddAttribute(i)}
                  onKeyDown={(e) => handleAddAttribute(i, e)}
                />
              </TableCell>
            </TableRow>
          </Fragment>
        );
      })}
    </Table>
  );
};
