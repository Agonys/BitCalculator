import { Fragment, type KeyboardEvent, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  type Control,
  Controller,
  type Path,
  type UseFieldArrayReturn,
  type UseFormRegister,
  type UseFormSetValue,
} from 'react-hook-form';
import {
  InputWithDropdown,
  LabelContainer,
  SearchableItemTile,
  StyledAccordion,
  Table,
  TableAddRow,
  TableCell,
  TableInput,
} from '@/components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  itemCraftingProfessionsDropdownOptions,
  itemCraftingStationsDropdownOptions,
  itemCraftingToolsDropdownOptions,
  itemTiersDropdownOptions,
} from '@/constants';
import type { Item, ItemForm } from '@/db';
import { getItemSuggestionsByName } from '@/db/functions';
import { cn, isSubmitKey } from '@/lib';

interface CraftOptionsTableProps {
  itemsArray: UseFieldArrayReturn<ItemForm, 'craftOptions', 'id'>;
  register: UseFormRegister<ItemForm>;
  control: Control<ItemForm>;
  setValue: UseFormSetValue<ItemForm>;
}
// LEVEL | PROFESSION | TOOL | BUILDING
export const CraftOptionsTable = ({ itemsArray, control, register, setValue }: CraftOptionsTableProps) => {
  const [suggestions, setSuggestions] = useState<Item[]>([]);

  const handleItemTileSuggestions = (itemName: string) => {
    if (!itemName.trim()) {
      setSuggestions([]);
      return;
    }

    const results = getItemSuggestionsByName(itemName);
    setSuggestions(results);
  };

  const handleSelectItem = (field: Path<Item>, item: Item) => {
    setValue(field, item.id);
    setSuggestions([]);
  };

  const removeSelectedDependencyItem = (field: Path<Item>) => {
    setValue(field, '');
    itemsArray.swap(0, 0);
  };

  const removeCraftingOption = (optionIndex: number, e?: KeyboardEvent<HTMLDivElement>) => {
    if (e && !isSubmitKey(e)) return;

    itemsArray.remove(optionIndex);
  };

  const removeCraftingDependency = (
    dependency: 'input' | 'output',
    optionIndex: number,
    dependencyIndex: number,
    e?: KeyboardEvent<HTMLDivElement>,
  ) => {
    if (e && !isSubmitKey(e)) return;

    const currentEntry = itemsArray.fields[optionIndex];
    const listOfDependencies = currentEntry[dependency];

    if (listOfDependencies.length === 1) return;

    itemsArray.update(optionIndex, {
      ...currentEntry,
      [dependency]: listOfDependencies.filter((_, i) => i !== dependencyIndex),
    });
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
      [dependency]: [...listOfDependencies, { id: '', quantity: '' }],
    });
  };

  return (
    <>
      {itemsArray.fields.map((field, i) => (
        <StyledAccordion
          key={field.id}
          name={`Option ${i + 1}`}
          defaultValue={`Option ${i + 1}`}
          className="flex-col-gap-2 p-4"
        >
          <div className="flex-gap-6 items-end">
            <LabelContainer name="Level">
              <Input
                type="text"
                placeholder="Level"
                {...register(`craftOptions.${i}.level` as const)}
                className="w-[80px]"
              />
            </LabelContainer>
            <LabelContainer name="profession">
              <Controller
                control={control}
                name={`craftOptions.${i}.profession`}
                render={({ field }) => (
                  <InputWithDropdown
                    list={itemCraftingProfessionsDropdownOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select Profession..."
                    triggerClassName="min-w-[150px]"
                  />
                )}
              />
            </LabelContainer>
            <LabelContainer name="Tool Name">
              <Controller
                control={control}
                name={`craftOptions.${i}.tool.name`}
                render={({ field }) => (
                  <InputWithDropdown
                    list={itemCraftingToolsDropdownOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select Tool..."
                  />
                )}
              />
            </LabelContainer>
            <LabelContainer name="Tool Tier">
              <Controller
                control={control}
                name={`craftOptions.${i}.tool.tier`}
                render={({ field }) => (
                  <InputWithDropdown
                    list={itemTiersDropdownOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select tier..."
                  />
                )}
              />
            </LabelContainer>
            <LabelContainer name="Building Name">
              <Controller
                control={control}
                name={`craftOptions.${i}.building.name`}
                render={({ field }) => (
                  <InputWithDropdown
                    list={itemCraftingStationsDropdownOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select Building..."
                    triggerClassName="min-w-[200px]"
                  />
                )}
              />
            </LabelContainer>
            <LabelContainer name="Building Tier">
              <Controller
                control={control}
                name={`craftOptions.${i}.building.tier`}
                render={({ field }) => (
                  <InputWithDropdown
                    list={itemTiersDropdownOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select tier..."
                  />
                )}
              />
            </LabelContainer>
            <div
              tabIndex={0}
              className="focus-ring-inset cursor-pointer rounded-md p-2"
              onClick={() => removeCraftingOption(i)}
              onKeyDown={(e) => removeCraftingOption(i, e)}
            >
              <Trash2 size={30} className="text-red-700" />
            </div>
          </div>

          <div className="flex-gap-2 w-full items-start">
            {/* Input table */}
            <div className="flex-col-gap-2 w-full">
              <LabelContainer name="Input" />
              <Table className="grid-cols-[1fr_100px_--spacing(8)]" data-id={`input-${i}`}>
                <TableCell isHeader>Item Name</TableCell>
                <TableCell isHeader>Quantity</TableCell>
                <TableCell isHeader></TableCell>
                {field.input.map((input, j) => {
                  return (
                    <Fragment key={`${field.id}-${j}-input`}>
                      <TableCell>
                        <SearchableItemTile
                          suggestions={suggestions}
                          onChange={handleItemTileSuggestions}
                          selectedItemId={input.id}
                          triggerClassName="border-0 rounded-none"
                          onSelectItem={(item) => handleSelectItem(`craftOptions.${i}.input.${j}.id`, item)}
                          removeSelectedItemId={() => removeSelectedDependencyItem(`craftOptions.${i}.input.${j}.id`)}
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
                        onClick={() => removeCraftingDependency('input', i, j)}
                        onKeyDown={(e) => removeCraftingDependency('input', i, j, e)}
                        title={field.input.length <= 1 ? 'At least 1 entry required' : ''}
                        className={cn('cursor-pointer border-r-0 text-red-700', {
                          'cursor-not-allowed text-neutral-600': field.input.length <= 1,
                        })}
                      >
                        <Trash2 className="size-4" />
                      </TableCell>
                    </Fragment>
                  );
                })}
                <TableCell className="col-span-3">
                  <TableAddRow
                    className="border-t-0"
                    text="Add new input item"
                    onClick={() => addCraftingDependency('input', i)}
                    onKeyDown={(e) => addCraftingDependency('input', i, e)}
                  />
                </TableCell>
              </Table>
            </div>

            {/* Output table */}
            <div className="flex-col-gap-2 w-full">
              <LabelContainer name="Output" />
              <Table className="grid-cols-[1fr_100px_--spacing(8)]" data-id={`output-${i}`}>
                <TableCell isHeader>Item Name</TableCell>
                <TableCell isHeader>Quantity</TableCell>
                <TableCell isHeader></TableCell>
                {field.output.map((input, j) => {
                  return (
                    <Fragment key={`${field.id}-${j}-input`}>
                      <TableCell>
                        <SearchableItemTile
                          suggestions={suggestions}
                          onChange={handleItemTileSuggestions}
                          selectedItemId={input.id}
                          triggerClassName="border-0 rounded-none"
                          onSelectItem={(item) => handleSelectItem(`craftOptions.${i}.output.${j}.id`, item)}
                          removeSelectedItemId={() => removeSelectedDependencyItem(`craftOptions.${i}.output.${j}.id`)}
                        />
                      </TableCell>
                      <TableCell>
                        <TableInput
                          type="number"
                          placeholder="Quantity"
                          className="h-full"
                          {...register(`craftOptions.${i}.output.${j}.quantity` as const)}
                        />
                      </TableCell>
                      <TableCell
                        onClick={() => removeCraftingDependency('output', i, j)}
                        onKeyDown={(e) => removeCraftingDependency('output', i, j, e)}
                        title={field.output.length <= 1 ? 'At least 1 entry required' : ''}
                        className={cn('cursor-pointer border-r-0 text-red-700', {
                          'cursor-not-allowed text-neutral-600': field.output.length <= 1,
                        })}
                      >
                        <Trash2 className="size-4" />
                      </TableCell>
                    </Fragment>
                  );
                })}
                <TableCell className="col-span-3">
                  <TableAddRow
                    className="border-t-0"
                    text="Add new output item"
                    onClick={() => addCraftingDependency('output', i)}
                    onKeyDown={(e) => addCraftingDependency('output', i, e)}
                  />
                </TableCell>
              </Table>
            </div>
          </div>
        </StyledAccordion>
      ))}
    </>
  );
};
