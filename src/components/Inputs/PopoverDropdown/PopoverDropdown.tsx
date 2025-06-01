import { type Dispatch, type FormEvent, type SetStateAction, useState } from 'react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface PopoverDropdownProps {
  list: Array<{
    label: string;
    value: string;
  }>;
  value: string;
  placeholder: string;
  setValue: Dispatch<SetStateAction<string>>;
  onSelect?: () => void;
}
export const PopoverDropdown = ({ list, value, placeholder, setValue, onSelect }: PopoverDropdownProps) => {
  const [isOpen, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleSelect = (newValue: PopoverDropdownProps['list'][number]['value']) => {
    setValue(newValue === value ? '' : newValue);
    setOpen(false);
    setInputValue('');
    onSelect?.();
  };

  const handleInput = (value: string) => {
    setOpen(true);
    setInputValue(value);
  };

  return (
    <Popover open={isOpen} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className={cn('text-muted-foreground w-full justify-between', {
            'text-foreground': !!value,
          })}
          onKeyDown={(e) => {
            const value = e.nativeEvent.key;
            if (value.length > 1) return;
            handleInput(value);
          }}
        >
          {value ? list.find((framework) => framework.value === value)?.label : placeholder}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border-input w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search framework..."
            value={inputValue}
            onInput={(e) => {
              const { value } = e.target as HTMLInputElement;
              handleInput(value);
            }}
          />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {list.map((framework) => (
                <CommandItem key={framework.value} value={framework.value} onSelect={handleSelect}>
                  <CheckIcon className={cn('mr-2 h-4 w-4', value === framework.value ? 'opacity-100' : 'opacity-0')} />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
