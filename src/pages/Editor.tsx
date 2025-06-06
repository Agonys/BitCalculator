import { useState } from 'react';
import type { ComponentProps } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  entityTypes,
  itemCategories,
  itemCategoriesDropdownOptions,
  itemEntityTypesDropdownOptions,
  itemRarities,
  itemRaritiesDropdownOptions,
  itemTiers,
  itemTiersDropdownOptions,
} from '@/constants';
import { getItemByName } from '@/db/functions';
import type { ItemForm } from '@/db/types';

const defaultValues: ItemForm = {
  id: '',
  icon: '',
  name: '',
  tier: '',
  rarity: '',
  category: '',
  entityType: '',
  effects: [],
  attributes: [],
  craftOptions: [],
  requirements: [],
};

export const Editor = () => {
  const [isNewItem, setIsNewItem] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemForm>({
    defaultValues,
    mode: 'onChange',
  });

  const requirementsArray = useFieldArray({ control, name: 'requirements' });
  const attributesArray = useFieldArray({ control, name: 'attributes' });
  const effectsArray = useFieldArray({ control, name: 'effects' });
  const craftOptionsArray = useFieldArray({ control, name: 'craftOptions' });

  const handleFormSubmit = (data: ItemForm) => {
    // if (!data.id) return;
    console.log(data);
  };

  const handleResetForm = () => {
    reset(defaultValues);
  };

  const handleAddNewAttribute = () => attributesArray.append({ name: '', valueMin: '' });
  const handleAdNewRequirement = () => requirementsArray.append({ level: '' });
  const handleAddNewEffect = () =>
    effectsArray.append({ name: '', attributes: [{ name: '', timeUnit: '', value: '' }] });
  const handleAddNewCraftingOption = () => {
    craftOptionsArray.append({
      level: '',
      profession: '',
      building: {
        name: '',
        tier: '',
      },
      tool: {
        name: '',
        tier: '',
      },
      input: [{ id: '', quantity: '' }],
      output: [{ id: '', quantity: '' }],
    });
  };

  return (
    <>
      <PageTitle text="Recipe editor tool" description="Add or modify recipes with all possible details" />

      <form
        className="flex w-full flex-col items-start justify-start gap-6"
        onSubmit={handleSubmit(handleFormSubmit, (errors) => {
          console.log('Validation errors:', errors);
        })}
      >
        <div className="flex w-full items-end gap-2">
          <div className="flex flex-col gap-2">
            <Label>Search item</Label>
            {/* There has to be input but without setting item as a button */}
          </div>

          <Button
            onClick={(e) => {
              e.preventDefault();
              setIsNewItem(true);
            }}
          >
            <Plus />
            Add new
          </Button>

          {/* Reset button with confirmation */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={!isNewItem}>
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
                <AlertDialogAction onClick={handleResetForm}>Continue</AlertDialogAction>
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

                  <LabelContainer name="Name *">
                    <Controller
                      control={control}
                      name="name"
                      rules={{
                        required: 'Name is required',
                        validate: (value) => getItemByName(value) === null || 'This item already exists',
                      }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder="Name"
                          autoComplete="off"
                          variant={errors.name ? 'error' : 'default'}
                          {...field}
                        />
                      )}
                    />
                    {errors.name && <span className="text-destructive text-xs">{errors.name.message}</span>}
                  </LabelContainer>

                  <LabelContainer name="Tier *">
                    <Controller
                      control={control}
                      name="tier"
                      rules={{
                        required: 'Tier is required',
                        validate: (value) => value && itemTiers.includes(value),
                      }}
                      render={({ field: { value, onChange } }) => (
                        <InputWithDropdown
                          list={itemTiersDropdownOptions}
                          placeholder="Select Tier..."
                          value={value}
                          onChange={onChange}
                          hasError={!!errors.tier}
                        />
                      )}
                    />
                    {errors.tier && <span className="text-destructive text-xs">{errors.tier.message}</span>}
                  </LabelContainer>

                  <LabelContainer name="Rarity *">
                    <Controller
                      control={control}
                      name="rarity"
                      rules={{
                        required: 'Rarity is required',
                        validate: (value) => value && itemRarities.includes(value),
                      }}
                      render={({ field }) => (
                        <InputWithDropdown
                          list={itemRaritiesDropdownOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select Rarity..."
                          hasError={!!errors.rarity}
                        />
                      )}
                    />
                    {errors.rarity && <span className="text-destructive text-xs">{errors.rarity.message}</span>}
                  </LabelContainer>

                  <LabelContainer name="Category *">
                    <Controller
                      control={control}
                      name="category"
                      rules={{
                        required: 'Category is required',
                        validate: (value) => value && itemCategories.includes(value),
                      }}
                      render={({ field }) => (
                        <InputWithDropdown
                          list={itemCategoriesDropdownOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select Category..."
                          hasError={!!errors.category}
                        />
                      )}
                    />
                    {errors.category && <span className="text-destructive text-xs">{errors.category.message}</span>}
                  </LabelContainer>

                  <LabelContainer name="Entity Type *">
                    <Controller
                      control={control}
                      name="entityType"
                      rules={{
                        required: 'Entity Type is required',
                        validate: (value) => value && entityTypes.includes(value),
                      }}
                      render={({ field }) => (
                        <InputWithDropdown
                          list={itemEntityTypesDropdownOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select Entity type..."
                          hasError={!!errors.entityType}
                        />
                      )}
                    />
                    {errors.entityType && <span className="text-destructive text-xs">{errors.entityType.message}</span>}
                  </LabelContainer>
                </Column>
                <Column>
                  <StyledAccordion name="Attributes" defaultOpen={true}>
                    <AttributesTable itemsArray={attributesArray} control={control} errors={errors} />
                    <TableAddRow onClick={handleAddNewAttribute} onKeyDown={handleAddNewAttribute} />
                  </StyledAccordion>

                  <StyledAccordion name="Requirements" defaultOpen={true}>
                    <RequirementsTable itemsArray={requirementsArray} control={control} errors={errors} />
                    <TableAddRow onClick={handleAdNewRequirement} onKeyDown={handleAdNewRequirement} />
                  </StyledAccordion>

                  <StyledAccordion name="Effects" defaultOpen={true}>
                    <EffectsTable itemsArray={effectsArray} control={control} errors={errors} />
                    <TableAddRow onClick={handleAddNewEffect} onKeyDown={handleAddNewEffect} />
                  </StyledAccordion>
                </Column>
                <Column>
                  <div className="flex w-max items-center gap-4">
                    <LabelContainer name="Crafting Options" className="whitespace-nowrap" />
                    <div className="flex w-full items-center justify-start gap-8">
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddNewCraftingOption();
                        }}
                      >
                        <Plus />
                        Add new
                      </Button>
                    </div>
                  </div>
                  <CraftOptionsTable
                    control={control}
                    itemsArray={craftOptionsArray}
                    errors={errors}
                    register={register}
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

const Column = ({ children }: ComponentProps<'div'>) => <div className="flex flex-col gap-4">{children}</div>;
