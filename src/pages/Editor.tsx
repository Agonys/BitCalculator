import { type ChangeEvent, type ReactNode, useMemo, useState } from 'react';
import { CircleCheck, Minus, Plus } from 'lucide-react';
import { Dropzone, PageTitle, PopoverDropdown, SearchWithSuggestions } from '@/components';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Item } from '@/db';
import { getItemSuggestionsByName } from '@/db/functions';
import { useClickOutside } from '@/hooks';
import { debounce } from '@/lib';
import { Label } from '@radix-ui/react-label';

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
  const [itemImage, setItemImage] = useState<string | null>(null);
  const [tier, setTier] = useState('');

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  const commandRef = useClickOutside<HTMLDivElement>(() => setSuggestionListOpen(false));

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

  return (
    <>
      <PageTitle text="Recipe editor tool" description="Add or modify recipes with all possible details" />

      <div className="flex w-full flex-col items-start justify-start gap-6">
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
            <Button variant="confirm" className="ml-auto justify-self-end">
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
                  <InputContainer>
                    <Label>Image:</Label>
                    <Dropzone className="aspect-square h-auto max-h-54 w-full max-w-54" onImageChange={setItemImage} />
                  </InputContainer>

                  <InputContainer>
                    <Label>ID:</Label>
                    <Input type="text" name="id" />
                  </InputContainer>
                  <InputContainer>
                    <Label>Name:</Label>
                    <Input type="text" name="name" />
                  </InputContainer>
                  <InputContainer>
                    <Label>Tier:</Label>
                    <PopoverDropdown list={frameworks} placeholder="Select Tier..." setValue={setTier} value={tier} />
                  </InputContainer>
                  <InputContainer>
                    <Label>Rarity:</Label>
                    <PopoverDropdown list={frameworks} placeholder="Select Rarity..." setValue={setTier} value={tier} />
                  </InputContainer>
                  <InputContainer>
                    <Label>Category:</Label>
                    <PopoverDropdown
                      list={frameworks}
                      placeholder="Select Category..."
                      setValue={setTier}
                      value={tier}
                    />
                  </InputContainer>
                  <InputContainer>
                    <Label>Entity type:</Label>
                    <PopoverDropdown
                      list={frameworks}
                      placeholder="Select Entity Type..."
                      setValue={setTier}
                      value={tier}
                    />
                  </InputContainer>
                </Column>
                <Column>
                  <div className="flex flex-col gap-2"></div>

                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <div className="mb-2 flex w-full items-center justify-between gap-8">
                        Attributes
                        <Button size="sm" variant="confirm">
                          <Plus />
                        </Button>
                      </div>
                    </CollapsibleTrigger>
                    <Separator />
                    <CollapsibleContent>
                      <Table>
                        <TableBody className="[&>tr>td:not(:last-child)]:border-r [&>tr>td:not(:last-child)]:p-0">
                          <TableRow>
                            <TableCell>
                              <input type="text" placeholder="name" className="p-2 outline-0" />
                            </TableCell>
                            <TableCell>
                              {' '}
                              <input
                                type="text"
                                pattern="^-?\d*\.?\d*$"
                                placeholder="min"
                                inputMode="decimal"
                                className="w-full max-w-[70px] p-2 outline-0"
                              />
                            </TableCell>
                            <TableCell>
                              <input type="text" placeholder="max" className="w-full max-w-[70px] p-2 outline-0" />
                            </TableCell>
                            <TableCell className="p-2!">
                              <Checkbox />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CollapsibleContent>
                  </Collapsible>
                </Column>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

const Column = ({ children }: { children: ReactNode }) => <div className="flex flex-col gap-4">{children}</div>;

const InputContainer = ({ children }: { children: ReactNode }) => (
  <div className="flex w-full flex-col gap-2">{children}</div>
);
