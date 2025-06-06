import { Fragment, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Trash2 } from 'lucide-react';
import type { Control, FieldErrors, UseFieldArrayReturn, UseFormRegister } from 'react-hook-form';
import { Controller } from 'react-hook-form';
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
  control: Control<ItemForm>;
  register: UseFormRegister<ItemForm>;
  errors: FieldErrors<ItemForm>;
}
export const CraftOptionsTable = ({ itemsArray, control, errors, register }: CraftOptionsTableProps) => {
  const [suggestions, setSuggestions] = useState<Item[] | null>([]);

  const handleClearSuggestions = () => setSuggestions(null);

  const handleItemTileSuggestions = (itemName: string) => {
    if (!itemName.trim()) {
      handleClearSuggestions();
      return;
    }

    const results = getItemSuggestionsByName(itemName);
    setSuggestions(results);
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
        <StyledAccordion key={field.id} name={`Option ${i + 1}`} defaultOpen={true} className="flex flex-col gap-2 p-4">
          <div className="flex flex-wrap items-end gap-6">
            <div className="flex gap-6">
              <LabelContainer name="Level">
                <Controller
                  control={control}
                  name={`craftOptions.${i}.level`}
                  rules={{
                    required: 'Crafting level is required',
                  }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Level"
                      className="w-[80px]"
                      {...field}
                      variant={errors.craftOptions?.[i]?.level ? 'error' : 'default'}
                    />
                  )}
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
            </div>
            <div className="flex gap-6">
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
            </div>
            <div className="flex gap-6">
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
            </div>
            <div
              tabIndex={0}
              role="button"
              aria-label={`Remove crafting option ${i + 1}`}
              className="focus-ring-inset cursor-pointer rounded-md p-2"
              onClick={() => removeCraftingOption(i)}
              onKeyDown={(e) => removeCraftingOption(i, e)}
            >
              <Trash2 size={30} className="text-red-700" />
            </div>
          </div>

          <div className="flex w-full flex-wrap items-start gap-2">
            {/* Input table */}
            <div className="flex flex-col gap-2">
              <LabelContainer name="Input" />
              <Table className="grid-cols-[minmax(200px,500px)_100px_--spacing(8)]" data-id={`input-${i}`}>
                <TableCell isHeader>Item Name</TableCell>
                <TableCell isHeader>Quantity</TableCell>
                <TableCell isHeader></TableCell>
                {field.input.map((_, j) => {
                  return (
                    <Fragment key={`${field.id}-${j}-input`}>
                      <TableCell>
                        <Controller
                          control={control}
                          name={`craftOptions.${i}.input.${j}.id`}
                          render={({ field }) => (
                            <SearchableItemTile
                              suggestions={suggestions}
                              clearSuggestions={handleClearSuggestions}
                              selectedItemId={field.value}
                              onChange={handleItemTileSuggestions}
                              onSelectItem={(item) => field.onChange(item.id)}
                              removeSelectedItemId={() => {
                                field.onChange(null);
                                setSuggestions(null);
                              }}
                              triggerClassName="border-0 rounded-none"
                            />
                          )}
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
                        role="button"
                        aria-label={`Remove crafting input row ${j + 1} from option ${i + 1}`}
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
                    text={`Add new input item to option ${i + 1}`}
                    onClick={() => addCraftingDependency('input', i)}
                    onKeyDown={(e) => addCraftingDependency('input', i, e)}
                  />
                </TableCell>
              </Table>
            </div>

            {/* Output table */}
            <div className="flex flex-col gap-2">
              <LabelContainer name="Output" />
              <Table
                className="auto-cols-1fr grid-cols-[minmax(200px,500px)_100px_--spacing(8)]"
                data-id={`output-${i}`}
              >
                <TableCell isHeader>Item Name</TableCell>
                <TableCell isHeader>Quantity</TableCell>
                <TableCell isHeader></TableCell>
                {field.output.map((_, j) => {
                  return (
                    <Fragment key={`${field.id}-${j}-output`}>
                      <TableCell>
                        <Controller
                          control={control}
                          name={`craftOptions.${i}.output.${j}.id`}
                          render={({ field }) => (
                            <SearchableItemTile
                              suggestions={suggestions}
                              clearSuggestions={handleClearSuggestions}
                              selectedItemId={field.value}
                              onChange={handleItemTileSuggestions}
                              onSelectItem={(item) => field.onChange(item.id)}
                              removeSelectedItemId={() => {
                                field.onChange(null);
                                setSuggestions(null);
                              }}
                              triggerClassName="border-0 rounded-none"
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <TableInput
                          type="textAsNumber"
                          placeholder="Quantity"
                          className="h-full"
                          {...register(`craftOptions.${i}.output.${j}.quantity` as const)}
                        />
                      </TableCell>
                      <TableCell
                        role="button"
                        aria-label={`Remove crafting output row ${j + 1} from option ${i + 1}`}
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
                    text={`Add new output item to option ${i + 1}`}
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
