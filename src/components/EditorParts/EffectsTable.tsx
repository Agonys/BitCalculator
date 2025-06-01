import { Fragment, type KeyboardEvent } from 'react';
import { CornerDownRight, Plus, Trash2 } from 'lucide-react';
import { type Control, type UseFieldArrayReturn, type UseFormRegister, useFieldArray } from 'react-hook-form';
import type { Item } from '@/db';
import { cn } from '@/lib/utils';
import { TableInput } from '../Inputs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface EffectsTableProps {
  itemsArray: UseFieldArrayReturn<Item, 'effects', 'id'>;
  register: UseFormRegister<Item>;
  control: Control<Item>;
}
export const EffectsTable = ({ itemsArray, register, control }: EffectsTableProps) => {
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
    <Table className="[&_td]:p-0 [&_td:not(:last-child)]:border-r">
      <TableHeader>
        <TableRow>
          <TableHead className="max-w-8 min-w-8">1</TableHead>
          <TableHead className="w-full">2</TableHead>
          <TableHead className="max-w-8 min-w-8">3</TableHead>
          <TableHead className="max-w-8 min-w-8">4</TableHead>
          <TableHead className="max-w-8 min-w-8">5</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {itemsArray.fields.map((field, i) => {
          return (
            <Fragment key={field.id}>
              {/* Effect Row */}
              <TableRow>
                <TableCell colSpan={4}>
                  <TableInput type="text" placeholder="Effect name" {...register(`effects.${i}.name` as const)} />
                </TableCell>
                <TableCell className="w-8 max-w-8">
                  <Trash2
                    tabIndex={0}
                    role="button"
                    className="size-4 cursor-pointer text-red-700"
                    onClick={() => itemsArray.remove(i)}
                  />
                </TableCell>
              </TableRow>

              {/* Attribute Header */}
              {/* <TableRow>
                <TableCell />
                <TableCell className="font-bold">Name</TableCell>
                <TableCell className="font-bold">Value</TableCell>
                <TableCell className="font-bold">TimeUnit</TableCell>
                <TableCell />
              </TableRow> */}

              {/* Attribute Rows */}
              {field.attributes.map((_, j) => (
                <TableRow key={`${field.id}-${j}`}>
                  <TableCell />
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
                      {...register(`effects.${i}.attributes.${j}.value` as const, { valueAsNumber: true })}
                    />
                  </TableCell>
                  <TableCell>
                    <TableInput
                      type="text"
                      placeholder="TimeUnit"
                      {...register(`effects.${i}.attributes.${j}.timeUnit` as const)}
                    />
                  </TableCell>
                  <TableCell>
                    <Trash2
                      tabIndex={0}
                      role="button"
                      className="size-4 cursor-pointer text-red-700"
                      onClick={() =>
                        itemsArray.update(i, {
                          ...itemsArray.fields[i],
                          attributes: [...itemsArray.fields[i].attributes.filter((_, attrIndex) => attrIndex !== j)],
                        })
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}

              {/* Add new attribute button */}
              <TableRow>
                <TableCell className="mx-auto w-fit">
                  <CornerDownRight className="size-4" />
                </TableCell>
                <TableCell colSpan={100}>
                  <NewTableEntryButton
                    className="border-b-0"
                    text="Add new effect attribute"
                    onClick={() =>
                      itemsArray.update(i, {
                        ...itemsArray.fields[i],
                        attributes: [...itemsArray.fields[i].attributes, { name: '', value: '', timeUnit: '' }],
                      })
                    }
                  />
                </TableCell>
              </TableRow>
            </Fragment>
          );
        })}

        {/* Add new effect button */}
        <TableRow>
          <TableCell colSpan={5}>
            <NewTableEntryButton
              text="Add new effect"
              onClick={() =>
                itemsArray.append({
                  name: '',
                  attributes: [],
                })
              }
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

const NewTableEntryButton = ({
  onClick,
  text = 'Add new',
  className,
}: {
  onClick: () => void;
  text?: string;
  className?: string;
}) => (
  <div
    className={cn('w-full cursor-pointer border-b p-2', className)}
    onClick={onClick}
    role="presentation"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    }}
  >
    <div className="text-muted-foreground flex w-full items-center justify-center gap-2">
      <Plus className="size-4" /> {text}
    </div>
  </div>
);
