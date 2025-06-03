import { type ChangeEvent, type ReactNode, useMemo, useState } from 'react';
import { CircleCheck, Minus, Plus, Search } from 'lucide-react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  AttributesTable,
  CraftOptionsTable,
  Dropzone,
  EffectsTable,
  LabelContainer,
  PageTitle,
  PopoverDropdown,
  RequirementsTable,
  SearchWithSuggestions,
  StyledAccordion,
  TableAddRow,
} from '@/components';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Item } from '@/db';
import { getItemSuggestionsByName } from '@/db/functions';
import { useClickOutside } from '@/hooks';
import { debounce } from '@/lib';

const frameworks = [
  {
    value: 'Tier I',
    label: 'Tier I',
  },
  {
    value: 'Tier II',
    label: 'Tier II',
  },
  {
    value: 'Tier III',
    label: 'Tier III',
  },
  {
    value: 'Tier IV',
    label: 'Tier IV',
  },
  {
    value: 'Tier V',
    label: 'Tier V',
  },
];

export const Editor = () => {
  const [suggestions, setSuggestions] = useState<Item[]>([]);
  const [isSuggestionListOpen, setSuggestionListOpen] = useState(false);
  const [isNewItem, setIsNewItem] = useState(false);
  const [tier, setTier] = useState('');

  const { control, register, handleSubmit, getValues, setValue } = useForm<Item>({
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

  const handleFormSubmit = (data: Item) => {
    if (!data.id) return;
    console.log(data);
  };

  const commandRef = useClickOutside<HTMLDivElement>(() => setSuggestionListOpen(false));

  return (
    <>
      <PageTitle text="Recipe editor tool" description="Add or modify recipes with all possible details" />

      <form className="flex-col-gap-6 w-full items-start justify-start" onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="flex w-full items-end gap-2">
          <div className="flex-col-gap-2">
            <Label>Search item</Label>
            <SearchWithSuggestions
              isOpen={isSuggestionListOpen}
              onChange={handleChange}
              onFocus={handleChange}
              onClickOutside={handleClear}
              onSelect={handleSelect}
              placeholder="search item to modify..."
              suggestions={suggestions}
              withIcon
              onClear={handleClear}
              handleAddNew={handleAddNew}
              ref={commandRef}
            />
          </div>

          <Button onClick={() => setIsNewItem(true)}>
            <Plus />
            Add new
          </Button>
          <Button variant="destructive">
            <Minus />
            Reset
          </Button>
          {isNewItem && (
            <Button variant="confirm" type="submit" className="ml-auto justify-self-end">
              <CircleCheck />
              Save
            </Button>
          )}
        </div>
        {isNewItem && (
          <Card className="w-full">
            <CardContent>
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

                  <LabelContainer name="ID">
                    <Input type="text" {...register('id')} />
                  </LabelContainer>
                  <LabelContainer name="Name">
                    <Input type="text" {...register('name')} />
                  </LabelContainer>
                  <LabelContainer name="Tier">
                    <PopoverDropdown
                      list={frameworks}
                      placeholder="Select Tier..."
                      setValue={setTier}
                      value={tier}
                      {...register('tier')}
                    />
                  </LabelContainer>
                  <LabelContainer name="Rarity">
                    <PopoverDropdown list={frameworks} placeholder="Select Rarity..." setValue={setTier} value={tier} />
                  </LabelContainer>
                  <LabelContainer name="Category">
                    <PopoverDropdown
                      list={frameworks}
                      placeholder="Select Category..."
                      setValue={setTier}
                      value={tier}
                    />
                  </LabelContainer>
                  <LabelContainer name="Entity type">
                    <PopoverDropdown
                      list={frameworks}
                      placeholder="Select Entity Type..."
                      setValue={setTier}
                      value={tier}
                    />
                  </LabelContainer>
                </Column>
                <Column>
                  <StyledAccordion name="Attributes">
                    <AttributesTable itemsArray={attributesArray} control={control} register={register} />
                    <TableAddRow onClick={() => attributesArray.append({ name: '', valueMin: '' })} />
                  </StyledAccordion>

                  <StyledAccordion name="Requirements">
                    <RequirementsTable control={control} itemsArray={requirementsArray} register={register} />
                    <TableAddRow onClick={() => requirementsArray.append({ level: '' })} />
                  </StyledAccordion>

                  <StyledAccordion name="Effects">
                    <EffectsTable control={control} itemsArray={effectsArray} register={register} />
                    <TableAddRow
                      onClick={() =>
                        effectsArray.append({ name: '', attributes: [{ name: '', value: '', timeUnit: '' }] })
                      }
                    />
                  </StyledAccordion>
                </Column>
                <Column>
                  <LabelContainer name="Crafting Options" />
                  <CraftOptionsTable
                    control={control}
                    itemsArray={craftOptionsArray}
                    register={register}
                    setValue={setValue}
                  />
                </Column>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </>
  );
};

const Column = ({ children }: { children: ReactNode }) => <div className="flex-col-gap-4">{children}</div>;
