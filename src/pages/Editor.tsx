import { useMemo, useState } from 'react';
import type { ChangeEvent, ComponentProps } from 'react';
import { CircleCheck, Minus, Plus } from 'lucide-react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  AttributesTable,
  CraftOptionsTable,
  Dropzone,
  EffectsTable,
  InputWithDropdown,
  LabelContainer,
  PageTitle,
  RequirementsTable,
  StyledAccordion,
  TableAddRow,
} from '@/components';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  itemCategoriesDropdownOptions,
  itemEntityTypesDropdownOptions,
  itemRaritiesDropdownOptions,
  itemTiersDropdownOptions,
} from '@/constants';
import type { Item, ItemForm, TimeUnits } from '@/db';
import { getItemSuggestionsByName } from '@/db/functions';
import { debounce } from '@/lib';
import type { CheckedState } from '@radix-ui/react-checkbox';

export const Editor = () => {
  const [suggestions, setSuggestions] = useState<Item[]>([]);
  const [isSuggestionListOpen, setSuggestionListOpen] = useState(false);
  const [isNewItem, setIsNewItem] = useState(false);
  const [doDefineID, setDoDefineID] = useState<CheckedState>(false);

  const { control, register, handleSubmit, setValue, reset } = useForm<ItemForm>({
    defaultValues: {},
  });

  const requirementsArray = useFieldArray({ control, name: 'requirements' });
  const attributesArray = useFieldArray({ control, name: 'attributes' });
  const effectsArray = useFieldArray({ control, name: 'effects' });
  const craftOptionsArray = useFieldArray({ control, name: 'craftOptions' });

  const debouncedItemLookup = useMemo(
    () =>
      debounce((itemName: string) => {
        if (!itemName.trim()) {
          setSuggestionListOpen(false);
          return;
        }

        const results = getItemSuggestionsByName(itemName);
        setSuggestions(results);
        setSuggestionListOpen(true);
      }, 300),
    [],
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    debouncedItemLookup(e.target.value);
  };

  const handleSelect = (item: Item) => {
    console.log(item);
    handleClear();
  };

  const handleClear = () => {
    debouncedItemLookup('');
    setSuggestionListOpen(false);
  };

  const handleAddNew = () => {
    setIsNewItem(true);
    setSuggestionListOpen(false);
  };

  const handleFormSubmit = (data: ItemForm) => {
    // if (!data.id) return;
    console.log(data);
  };

  const handleAddNewAttribute = () => attributesArray.append({ name: '', valueMin: '' as unknown as number });
  const handleAdNewRequirement = () => requirementsArray.append({ level: '' as unknown as number });
  const handleAddNewEffect = () =>
    effectsArray.append({ name: '', attributes: [{ name: '', timeUnit: '' as unknown as TimeUnits, value: '' }] });
  const handleAddNewCraftingOption = () => {
    craftOptionsArray.append({
      level: '' as unknown as number,
      profession: '',
      building: {
        name: '',
        tier: '' as unknown as 1,
      },
      tool: {
        name: '',
        tier: '' as unknown as 1,
      },
      input: [{ id: '', quantity: '' as unknown as 1 }],
      output: [{ id: '', quantity: '' as unknown as 1 }],
    });
  };

  // Add mapping of consts to lists and also when resteing the form it's easier to swap it with empty object so that useFieldArrays should also update causing unwanted entries to disapear;

  return (
    <>
      <PageTitle text="Recipe editor tool" description="Add or modify recipes with all possible details" />

      <form className="flex-col-gap-6 w-full items-start justify-start" onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="flex w-full items-end gap-2">
          <div className="flex-col-gap-2">
            <Label>Search item</Label>
            {/* There has to be input but without setting item as a button */}
          </div>

          <Button onClick={() => setIsNewItem(true)}>
            <Plus />
            Add new
          </Button>

          {/* Reset button with confirmation */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Minus />
                Reset
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Do you want to reset?</AlertDialogTitle>
                <AlertDialogDescription>This will erase all the data from all inputs.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    reset();
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {isNewItem && (
            <Button variant="confirm" type="submit" className="ml-auto justify-self-end">
              <CircleCheck />
              Save
            </Button>
          )}
        </div>
        <Card className="w-full">
          <CardContent>
            {!isNewItem && (
              <div className="p-10">Edit existing item or create a new one by clicking "Add New" button</div>
            )}
            {isNewItem && (
              <div className="flex h-full w-full flex-wrap gap-12">
                <Column>
                  <LabelContainer name="Image">
                    <Controller
                      control={control}
                      name="icon"
                      render={({ field }) => (
                        <Dropzone className="aspect-square w-54 max-w-54" onImageChange={field.onChange} />
                      )}
                    />
                  </LabelContainer>

                  <label className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <Checkbox onCheckedChange={(e) => setDoDefineID(e)} /> Define ID{' '}
                    </div>
                    <span className="text-muted-foreground text-xs">(if not, transformed name will be used as ID)</span>
                  </label>
                  {doDefineID && (
                    <LabelContainer name="ID">
                      <Input type="text" {...register('id')} placeholder="ID" />
                    </LabelContainer>
                  )}

                  <LabelContainer name="Name">
                    <Input type="text" {...register('name')} placeholder="Name" />
                  </LabelContainer>
                  <LabelContainer name="Tier">
                    <Controller
                      control={control}
                      name="tier"
                      render={({ field: { value, onChange } }) => (
                        <InputWithDropdown
                          list={itemTiersDropdownOptions}
                          placeholder="Select Tier..."
                          value={value}
                          onChange={onChange}
                        />
                      )}
                    />
                  </LabelContainer>
                  <LabelContainer name="Rarity">
                    <Controller
                      control={control}
                      name="rarity"
                      render={({ field }) => (
                        <InputWithDropdown
                          list={itemRaritiesDropdownOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select Rarity..."
                        />
                      )}
                    />
                  </LabelContainer>
                  <LabelContainer name="Category">
                    <Controller
                      control={control}
                      name="category"
                      render={({ field }) => (
                        <InputWithDropdown
                          list={itemCategoriesDropdownOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select Category..."
                        />
                      )}
                    />
                  </LabelContainer>
                  <LabelContainer name="Entity Type">
                    <Controller
                      control={control}
                      name="entityType"
                      render={({ field }) => (
                        <InputWithDropdown
                          list={itemEntityTypesDropdownOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select Entity type..."
                        />
                      )}
                    />
                  </LabelContainer>
                </Column>
                <Column>
                  <StyledAccordion name="Attributes" defaultValue="Attributes">
                    <AttributesTable itemsArray={attributesArray} control={control} register={register} />
                    <TableAddRow onClick={handleAddNewAttribute} onKeyDown={handleAddNewAttribute} />
                  </StyledAccordion>

                  <StyledAccordion name="Requirements" defaultValue="Requirements">
                    <RequirementsTable control={control} itemsArray={requirementsArray} register={register} />
                    <TableAddRow onClick={handleAdNewRequirement} onKeyDown={handleAdNewRequirement} />
                  </StyledAccordion>

                  <StyledAccordion name="Effects" defaultValue="Effects">
                    <EffectsTable control={control} itemsArray={effectsArray} register={register} />
                    <TableAddRow onClick={handleAddNewEffect} onKeyDown={handleAddNewEffect} />
                  </StyledAccordion>
                </Column>
                <Column>
                  <div className="flex w-max items-center gap-4">
                    <LabelContainer name="Crafting Options" className="whitespace-nowrap" />
                    <div className="flex-gap-2 w-full items-center justify-start gap-8">
                      <Button variant="outline" onClick={handleAddNewCraftingOption}>
                        <Plus />
                        Add new
                      </Button>
                    </div>
                  </div>
                  <CraftOptionsTable
                    control={control}
                    itemsArray={craftOptionsArray}
                    register={register}
                    setValue={setValue}
                  />
                </Column>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </>
  );
};

const Column = ({ children }: ComponentProps<'div'>) => <div className="flex-col-gap-4">{children}</div>;
