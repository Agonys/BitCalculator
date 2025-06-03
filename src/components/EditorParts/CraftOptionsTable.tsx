import { type ChangeEvent, type KeyboardEvent, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  type Control,
  type Path,
  type UseFieldArrayReturn,
  type UseFormRegister,
  type UseFormSetValue,
} from 'react-hook-form';
import { LabelContainer, StyledAccordion, TableInput } from '@/components';
import { Table, TableAddRow, TableCell, TableHeader, TableRow } from '@/components/EditorParts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Item } from '@/db';
import { getItemSuggestionsByName } from '@/db/functions';
import { cn, isSubmitKey } from '@/lib';
import { SearchableItemtile } from '../SearchWithSuggestions/SearchableItemtile';

interface CraftOptionsTableProps {
  itemsArray: UseFieldArrayReturn<Item, 'craftOptions', 'id'>;
  register: UseFormRegister<Item>;
  control: Control<Item>;
  setValue: UseFormSetValue<Item>;
}
// LEVEL | PROFESSION | TOOL | BUILDING
export const CraftOptionsTable = ({ itemsArray, register, setValue }: CraftOptionsTableProps) => {
  const [suggestions, setSuggestions] = useState<Item[]>([]);

  const handleItemOnInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!value.trim()) return;

    const results = getItemSuggestionsByName(value);
    setSuggestions(results);
  };

  const handleSelectItem = (field: Path<Item>, item: Item) => {
    setValue(field, item.id);
    setSuggestions([]);
  };

  const removeSelectedInputItem = (field: Path<Item>) => {
    setValue(field, '');
    itemsArray.swap(0, 0);
  };

  const addCraftingOption = () => {
    itemsArray.append({
      level: '',
      profession: '',
      building: '',
      tool: '',
      input: [{ id: '', quantity: 1 }],
      output: [{ id: '', quantity: 1 }],
    });
  };

  const removeCraftingOption = (optionIndex: number, e?: KeyboardEvent<HTMLDivElement>) => {
    if (e && !isSubmitKey(e)) return;

    itemsArray.remove(optionIndex);
  };

  const removeCraftingOptionDependency = (
    dependency: 'input' | 'output',
    optionIndex: number,
    dependencyIndex: number,
    e?: KeyboardEvent<HTMLDivElement>,
  ) => {
    if (e && !isSubmitKey(e)) return;

    const currentEntry = itemsArray.fields[optionIndex];
    const listOfDependencies = currentEntry[dependency];

    itemsArray.update(optionIndex, {
      ...currentEntry,
      [dependency]: listOfDependencies.filter((_, i) => i !== dependencyIndex),
    });
    // });
  };

  const addCraftingDependency = (
    dependency: 'input' | 'output',
    optionIndex: number,
    e?: KeyboardEvent<HTMLDivElement>,
  ) => {
    if (e && !isSubmitKey(e)) return;

    const currentEntry = itemsArray.fields[optionIndex];
    const listOfDependencies = currentEntry[dependency];
    itemsArray.update(optionIndex, {
      ...currentEntry,
      [dependency]: [...listOfDependencies, { id: '', quantity: 1 }],
    });
  };

  return (
    <Card
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <CardContent className="flex-col-gap-6">
        <div className="flex-gap-2 w-full items-center justify-start gap-8">
          {itemsArray.fields.length === 0 && <p>No options found.</p>}
          <Button variant="outline" onClick={addCraftingOption}>
            <Plus />
            Add new
          </Button>
        </div>

        {itemsArray.fields.map((field, i) => (
          <StyledAccordion
            key={field.id}
            name={`Option ${i + 1}`}
            defaultValue={`Option ${i + 1}`}
            className="flex-col-gap-2 p-4"
          >
            <div className="flex-gap-6 items-end">
              <LabelContainer name="Level">
                <Input type="text" placeholder="Level" {...register(`craftOptions.${i}.level` as const)} />
              </LabelContainer>
              <LabelContainer name="Profession">
                <Input type="text" placeholder="Profession" {...register(`craftOptions.${i}.profession` as const)} />
              </LabelContainer>
              <LabelContainer name="Tool">
                <Input type="text" placeholder="Tool" {...register(`craftOptions.${i}.tool` as const)} />
              </LabelContainer>
              <LabelContainer name="Building">
                <Input type="text" placeholder="Building" {...register(`craftOptions.${i}.building` as const)} />
              </LabelContainer>
              <div
                className="cursor-pointer p-2"
                onClick={() => removeCraftingOption(i)}
                onKeyDown={(e) => removeCraftingOption(i, e)}
              >
                <Trash2 size={30} className="text-red-700" />
              </div>
            </div>
            <div className="flex-gap-2 w-full">
              <div className="flex-col-gap-2 w-full">
                <LabelContainer name="Input" />
                <Table className="grid-cols-[1fr_1fr_--spacing(8)]">
                  <TableHeader>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell></TableCell>
                  </TableHeader>
                  {field.input.map((input, j) => {
                    return (
                      <TableRow key={`${field.id}-${j}-input`}>
                        <TableCell>
                          <SearchableItemtile
                            suggestions={suggestions}
                            onChange={handleItemOnInput}
                            selectedItemId={input.id}
                            triggerClassName="border-0 rounded-none"
                            onSelectItem={(item) => handleSelectItem(`craftOptions.${i}.input.${j}.id`, item)}
                            removeSelectedItemId={() => removeSelectedInputItem(`craftOptions.${i}.input.${j}.id`)}
                          />
                        </TableCell>
                        <TableCell>
                          <TableInput
                            type="number"
                            placeholder="Quantity"
                            className="h-full"
                            {...register(`craftOptions.${i}.input.${j}.quantity` as const)}
                          />
                        </TableCell>
                        <TableCell
                          onClick={() => removeCraftingOptionDependency('input', i, j)}
                          onKeyDown={(e) => removeCraftingOptionDependency('input', i, j, e)}
                          title={field.input.length <= 1 ? 'At least 1 entry required' : ''}
                          className={cn('cursor-pointer text-red-700', {
                            'cursor-default text-gray-600': field.input.length <= 1,
                          })}
                        >
                          <Trash2 className="size-4" />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell className="col-span-2">
                      <TableAddRow
                        className="border-t-0"
                        text="Add new input item"
                        onClick={() => addCraftingDependency('input', i)}
                        onKeyDown={(e) => addCraftingDependency('input', i, e)}
                      />
                    </TableCell>
                  </TableRow>
                </Table>
              </div>
            </div>
          </StyledAccordion>
        ))}
      </CardContent>
    </Card>
  );
};
