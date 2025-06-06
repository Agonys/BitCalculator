import { capitalize } from './capitalize';

interface CreateDropdownOptionsFromListProps<T> {
  array: readonly T[] | T[];
  prefix?: string;
  suffix?: string;
}

export const createDropdownOptionsFromList = <T>({ array, prefix, suffix }: CreateDropdownOptionsFromListProps<T>) => {
  return array.map((item) => ({
    value: item,
    label: `${prefix ? capitalize(prefix) + ' ' : ''}${item}${suffix ? ' ' + suffix : ''}`,
  }));
};
