import { type ChangeEvent, type ReactNode, useMemo, useState } from 'react';
import { CircleCheck, Minus, Plus, Trash2 } from 'lucide-react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  AttributesTable,
  Dropzone,
  PageTitle,
  PopoverDropdown,
  RequirementsTable,
  SearchWithSuggestions,
  TableInput,
} from '@/components';
import { EffectsTable } from '@/components/EditorParts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Item } from '@/db';
import { getItemSuggestionsByName } from '@/db/functions';
import type { ItemAttribute } from '@/db/types';
import { useClickOutside } from '@/hooks';
import { debounce } from '@/lib';
import { cn } from '@/lib/utils';

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

  const { control, register, handleSubmit } = useForm<Item>({
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

  const commandRef = useClickOutside<HTMLDivElement>(() => setSuggestionListOpen(false));

  return (
    <>
      <PageTitle text="Recipe editor tool" description="Add or modify recipes with all possible details" />

      <form
        className="flex w-full flex-col items-start justify-start gap-6"
        onSubmit={handleSubmit((values) => {
          console.log(values);
        })}
      >
        <div className="flex w-full items-end gap-2">
          <div className="">
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
              <div className="flex h-full w-full gap-12">
                <Column>
                  <InputContainer name="Image">
                    <Controller
                      control={control}
                      name="icon"
                      render={({ field }) => (
                        <Dropzone className="aspect-square w-54 max-w-54" onImageChange={field.onChange} />
                      )}
                    />
                  </InputContainer>

                  <InputContainer name="ID">
                    <Input type="text" {...register('id')} />
                  </InputContainer>
                  <InputContainer name="Name">
                    <Input type="text" {...register('name')} />
                  </InputContainer>
                  <InputContainer name="Tier">
                    <PopoverDropdown list={frameworks} placeholder="Select Tier..." setValue={setTier} value={tier} />
                  </InputContainer>
                  <InputContainer name="Rarity">
                    <PopoverDropdown list={frameworks} placeholder="Select Rarity..." setValue={setTier} value={tier} />
                  </InputContainer>
                  <InputContainer name="Category">
                    <PopoverDropdown
                      list={frameworks}
                      placeholder="Select Category..."
                      setValue={setTier}
                      value={tier}
                    />
                  </InputContainer>
                  <InputContainer name="Entity type">
                    <PopoverDropdown
                      list={frameworks}
                      placeholder="Select Entity Type..."
                      setValue={setTier}
                      value={tier}
                    />
                  </InputContainer>
                </Column>
                <Column>
                  <StyledAccordion name="Attributes">
                    <NewTableEntryButton onClick={() => attributesArray.append({ name: '', valueMin: '' })} />
                    <AttributesTable itemsArray={attributesArray} control={control} register={register} />
                  </StyledAccordion>

                  <StyledAccordion name="Requirements">
                    <NewTableEntryButton onClick={() => requirementsArray.append({ level: '' })} />
                    <RequirementsTable control={control} itemsArray={requirementsArray} register={register} />
                  </StyledAccordion>

                  <StyledAccordion name="Effects">
                    <NewTableEntryButton onClick={() => effectsArray.append({ name: '', attributes: [] })} />
                    <EffectsTable control={control} itemsArray={effectsArray} register={register} />
                  </StyledAccordion>
                </Column>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </>
  );
};

const Column = ({ children }: { children: ReactNode }) => <div className="flex flex-col gap-4">{children}</div>;

const InputContainer = ({ children, name }: { children: ReactNode; name: string }) => (
  <Label className="flex w-full flex-col items-start gap-2 capitalize">
    {name}:{children}
  </Label>
);

const StyledAccordion = ({ name, children, className }: { name: string; children: ReactNode; className?: string }) => (
  <Accordion type="single" collapsible>
    <AccordionItem value={name}>
      <AccordionTrigger className="hover:bg-background [&[data-state=open]]:bg-background [&[data-state=closed]]:border-b-border hover:border-border flex min-w-[300px] cursor-pointer items-center rounded-b-none border border-transparent capitalize hover:no-underline">
        {name}
      </AccordionTrigger>
      <AccordionContent
        className={cn(
          'border-border flex max-h-[200px] flex-col overflow-hidden rounded-b-md border select-none',
          className,
        )}
      >
        {children}
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

const NewTableEntryButton = ({ onClick }: { onClick: () => void }) => (
  <div
    className="w-full cursor-pointer border-b p-2"
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
      <Plus className="size-4" /> Add new
    </div>
  </div>
);
