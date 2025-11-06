import { type ElementType, ReactNode, useMemo, useState, useEffect } from "react";
import { Checkbox, Chip, type ChipProps, type ChipTypeMap } from "@mui/material";
import type { FieldPath, FieldValues } from "react-hook-form";
import {
  AutocompleteElementDisplay,
  type AutocompleteElementDisplayProps,
} from "./AutocompleteElementDisplay";
import { getAutocompleteTypedValue } from "../utils";
import { useController } from "react-hook-form-mui";

/**
 * Interface for special "add option" objects used in freeSolo mode
 * These objects represent a new item that can be created from user input
 */
interface AddOptionType {
  __isAddOption: true;
  inputValue: string;
  [key: string]: any; // Allow for additional properties from stringToNewItem
}

/**
 * Extends AutocompleteElementDisplayProps with additional properties for handling object values.
 *
 * @template TValue - The type of the option values
 * @template Multiple - Boolean flag indicating if multiple selections are allowed
 * @template DisableClearable - Boolean flag indicating if clearing the selection is disabled
 * @template FreeSolo - Boolean flag indicating if free text input is allowed
 * @template ChipComponent - The component type used for rendering chips in multiple selection mode
 * @template TFieldValues - The type of the form values
 * @template TName - The type of the field name
 */
export type ObjectElementDisplayProps<
  TValue,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
  ChipComponent extends ElementType = ChipTypeMap["defaultComponent"],
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = AutocompleteElementDisplayProps<
  TValue,
  Multiple,
  DisableClearable,
  FreeSolo,
  ChipComponent,
  TFieldValues,
  TName
> & {
  /**
   * Function to extract a unique key from an option value.
   * Used for option comparison and deduplication.
   *
   * @param value - The option value or null
   * @returns A unique string key for the value
   */
  getItemKey: (value: TValue | null) => string;

  /**
   * Function to generate a display label for an option value.
   * Can return any ReactNode for custom rendering.
   *
   * @param value - The option value or null
   * @returns A ReactNode to display as the option label
   */
  getItemLabel: (value: TValue | null) => ReactNode;

  /**
   * Function to convert a free text input string to a TValue object.
   * Required when freeSolo is true to create new items from text input.
   *
   * @param value - The string value entered by the user
   * @returns A new TValue object created from the string
   */
  stringToNewItem?: (value: string) => TValue;

  /**
   * Whether the input allows free text entry.
   * When true, users can enter values that are not in the options.
   */
  freeSolo?: FreeSolo;

  /**
   * Optional function that returns additional chip props based on the value.
   * This allows for customizing chip appearance and behavior based on the value it represents.
   *
   * @param value - The option value being rendered as a chip
   * @returns Additional props to apply to the Chip component
   */
  getChipProps?: (props: { value: TValue; index: number }) => Partial<ChipProps> | undefined;

  /**
   * Optional function to transform the value before it's updated in the form.
   * This allows for custom processing or enrichment of the selected value.
   *
   * @param value - The value that would normally be sent to the form
   * @returns The transformed value to be stored in the form
   */
  transformValue?: Multiple extends true
    ? (value: TValue[]) => TFieldValues
    : (value: TValue | null) => TFieldValues | null;
};

/**
 * A form component that displays a searchable dropdown for selecting object values.
 * Extends AutocompleteElementDisplay with object-specific functionality.
 *
 * Features:
 * - Works with complex object values instead of just primitive types
 * - Supports both single and multiple selection modes
 * - Supports free-solo mode for creating new items from text input
 * - Handles initial values that aren't in the default options
 * - Deduplicates options based on item keys
 *
 * @template TValue - The type of the option values
 * @template Multiple - Boolean flag indicating if multiple selections are allowed
 * @template DisableClearable - Boolean flag indicating if clearing the selection is disabled
 * @template FreeSolo - Boolean flag indicating if free text input is allowed
 * @template ChipComponent - The component type used for rendering chips in multiple selection mode
 * @template TFieldValues - The type of the form values
 * @template TName - The type of the field name
 *
 * @returns A React component for selecting object values
 */
export const ObjectElementDisplay = <
  TValue,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
  ChipComponent extends ElementType = ChipTypeMap["defaultComponent"],
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  options,
  autocompleteProps,
  getItemKey,
  getItemLabel,
  getChipProps,
  stringToNewItem,
  transformValue,
  name,
  freeSolo,
  control,
  ...props
}: ObjectElementDisplayProps<
  TValue,
  Multiple,
  DisableClearable,
  FreeSolo,
  ChipComponent,
  TFieldValues,
  TName
>) => {
  /**
   * Access to the form field controller
   */
  const { field } = useController({ name, control });

  /**
   * State for storing dynamically added options that aren't in the original options list
   * Includes both default values and values added during freeSolo mode
   */
  const [newOptions, setNewOptions] = useState<TValue[]>(() => {
    if (!field.value) return [];

    // Convert field value to array for consistent handling
    const fieldValues: TValue[] = Array.isArray(field.value) ? field.value : [field.value];

    // Keep only object values that don't exist in the options array
    return fieldValues.filter(value => 
      typeof value !== "string" && 
      !options.some(option => getItemKey(option) === getItemKey(value))
    );
  });

  /**
   * Update newOptions when field.value changes
   * This ensures that any new values added to the field after rendering
   * are properly included in newOptions and displayed
   */
  useEffect(() => {
    if (!field.value) return;

    const fieldValues: TValue[] = Array.isArray(field.value) ? field.value : [field.value];
    const newFieldOptions = fieldValues.filter(
      (value) => 
        typeof value !== "string" && 
        ![...options, ...newOptions].some(option => getItemKey(option) === getItemKey(value))
    );

    // Only update newOptions if there are new values to add
    if (newFieldOptions.length > 0) {
      setNewOptions(prevOptions => [...prevOptions, ...newFieldOptions]);
    }
  }, [field.value, options, newOptions, getItemKey]);

  /**
   * Combined list of all available options (original + dynamically added)
   */
  const allOptions = useMemo(() => [...options, ...newOptions], [options, newOptions]);


  return (
    <AutocompleteElementDisplay
      name={name}
      control={control}
      options={allOptions}
      {...props}
      autocompleteProps={{
        /**
         * Determines if two options should be considered equal
         * Uses the getItemKey function to compare option values
         */
        isOptionEqualToValue: (o, v) => getItemKey(o) === getItemKey(v),

        /**
         * Filters options based on the input value
         * Checks if the option key or label contains the input value (case-insensitive)
         * For freeSolo mode, adds a special "Add [value]" option when there's no exact match
         */
        filterOptions: (options, { inputValue }) => {
          if (!inputValue) return options;

          const searchValue = inputValue.toLowerCase();

          // Filter options that match the input value (by key or label)
          const filteredOptions = options.filter(option => {
            const key = getItemKey(option).toLowerCase();
            const label = String(getItemLabel(option)).toLowerCase();
            return key.includes(searchValue) || label.includes(searchValue);
          });

          // For freeSolo mode, add "Add [value]" option if no exact match exists
          if (freeSolo && stringToNewItem && inputValue.length > 0) {
            const hasExactMatch = filteredOptions.some(option => 
              String(getItemLabel(option)).toLowerCase() === searchValue
            );

            if (!hasExactMatch) {
              // Create a special option with a __isAddOption flag
              const addOption: AddOptionType = {
                __isAddOption: true,
                inputValue,
                ...stringToNewItem(inputValue) // Include properties for type compatibility
              };

              return [addOption as unknown as TValue, ...filteredOptions];
            }
          }

          return filteredOptions;
        },
        freeSolo, // Allowed to enter own string value
        autoComplete: true,
        autoHighlight: true, // The first option is highlighted by default
        openOnFocus: true, // Opens the menu when tabbed into

        /**
         * Custom rendering for each option in the dropdown list
         * Handles both regular options and special "Add" options in freeSolo mode
         */
        renderOption: (liProps, option, { selected }, ownerState) => {
          // Handle special "Add" option in freeSolo mode
          if (ownerState?.freeSolo && 
              typeof option === 'object' && 
              option !== null && 
              '__isAddOption' in option) {
            const inputValue = (option as unknown as AddOptionType).inputValue;
            return (
              <li {...liProps} key={`${name}-add-option-${inputValue}`}>
                Add: '{inputValue}'
              </li>
            );
          }

          // Handle regular option
          return (
            <li {...liProps} key={`${name}-option-${getItemKey(option)}`}>
              {(props?.showCheckbox || ownerState?.multiple) && 
                <Checkbox sx={{ marginRight: 1 }} checked={selected} />}
              {typeof option === "string" ? option : getItemLabel(option)}
            </li>
          );
        },

        onChange: (event, value, reason, details) => {
          /**
           * Helper function to apply transformValue if provided, otherwise return the original value
           */
          const applyTransform = (val: any) => {
            return transformValue && val !== null 
              ? field.onChange(transformValue(val))
              : field.onChange(val);
          };

          /**
           * Helper function to add a new item to newOptions if it doesn't exist already
           */
          const addToNewOptions = (item: TValue) => {
            const itemKey = getItemKey(item);
            const itemExists = [...options, ...newOptions].some(
              option => getItemKey(option) === itemKey
            );

            if (!itemExists) {
              setNewOptions(prev => [...prev, item]);
            }
          };

          /**
           * Helper function to extract input value from string or AddOption
           */
          const getInputValue = (item: any): string | null => {
            if (typeof item === "string" && item.length > 0) {
              return item;
            }
            if (typeof item === 'object' && item !== null && '__isAddOption' in item) {
              return (item as unknown as AddOptionType).inputValue;
            }
            return null;
          };

          // Handle freeSolo mode with stringToNewItem function
          if (freeSolo && stringToNewItem) {
            // Handle special add option selection or string input
            const inputValue = getInputValue(value);

            if (inputValue) {
              const newItem = stringToNewItem(inputValue);

              if (props.multiple) {
                // For multiple selection, add the new item to the current values
                const currentValues = Array.isArray(field.value) ? field.value : [];
                const newValues = [...currentValues, newItem];
                applyTransform(newValues);
              } else {
                // For single selection, just use the new item
                applyTransform(newItem);
              }

              addToNewOptions(newItem);
              return;
            }

            // Handle array values (multiple selection)
            if (Array.isArray(value) && props.multiple) {
              // Convert any string values to objects and handle special add options
              const newValues = value?.map(item => {
                const inputVal = getInputValue(item);
                return inputVal ? stringToNewItem(inputVal) : item;
              }) ?? [];

              applyTransform(newValues);

              // Add any new items to newOptions
              const allOptionsKeys = [...options, ...newOptions].map(option => getItemKey(option));
              const newItems = newValues.filter(
                item => typeof item !== "string" && !allOptionsKeys.includes(getItemKey(item))
              );

              if (newItems.length > 0) {
                setNewOptions(prev => [...prev, ...newItems]);
              }
              return;
            }
          }

          // Default behavior for non-freeSolo cases
          if (transformValue && value !== null) {
            applyTransform(value as TValue | TValue[]);
          } else {
            autocompleteProps?.onChange?.(event, value, reason, details);
          }
        },

        /**
         * Custom rendering for the selected value(s)
         * For multiple selection, renders a Chip for each selected value
         * For single selection, renders the value as text
         * Uses getItemLabel to render the value labels
         */
        renderValue: (value, getItemProps, ownerState) => {
          const typedValue = getAutocompleteTypedValue(value, ownerState);

          // Handle array values (multiple selection)
          if (Array.isArray(typedValue)) {
            return typedValue.map((v, index) => {
              // @ts-expect-error a key is returned, and the linter doesn't pick this up
              const { key, ...chipProps } = getItemProps({ index });

              // Get the label - use string directly or extract from object
              const label = typeof v === "string" ? v : getItemLabel(v);

              // Get additional chip props if available
              const valueSpecificProps = 
                typeof v !== "string" && getChipProps ? getChipProps({ value: v, index }) : {};

              return (
                <Chip
                  key={`${name}-chip-${key}`}
                  {...valueSpecificProps}
                  {...chipProps}
                  label={label}
                />
              );
            });
          }

          // Handle single value - return string or extracted label
          return typeof typedValue === "string" 
            ? typedValue 
            : typedValue ? getItemLabel(typedValue as NonNullable<TValue>) : "";
        },
        ...autocompleteProps,
      }}
    />
  );
};
