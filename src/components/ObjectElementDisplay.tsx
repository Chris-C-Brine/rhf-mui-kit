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
   * This includes:
   * - Default values that aren't in the option list (regardless of freeSolo mode)
   * - Dynamically added values from freeSolo mode
   */
  const [newOptions, setNewOptions] = useState<TValue[]>(() => {
      if (!field.value) return [];
      const fieldValues: TValue[] = Array.isArray(field.value) ? field.value : [field.value];
      return fieldValues.filter((value) => {
        // Skip string values as they're handled differently
        if (typeof value === "string") return false;

        // Check if this value exists in options
        return !options.some((option) => getItemKey(option) === getItemKey(value));
      });
  });

  /**
   * Update newOptions when field.value changes
   * This ensures that any new values added to the field after rendering
   * are properly included in newOptions and displayed
   */
  useEffect(() => {
    if (!field.value) return;

    const fieldValues: TValue[] = Array.isArray(field.value) ? field.value : [field.value];
    const newFieldOptions = fieldValues.filter((value) => {
      // Skip string values as they're handled differently
      if (typeof value === "string") return false;

      // Check if this value exists in options or newOptions
      return !options.some((option) => getItemKey(option) === getItemKey(value)) &&
             !newOptions.some((option) => getItemKey(option) === getItemKey(value));
    });

    // Only update newOptions if there are new values to add
    if (newFieldOptions.length > 0) {
      setNewOptions(prevOptions => [...prevOptions, ...newFieldOptions]);
    }
  }, [field.value, options, newOptions, getItemKey]);

  /**
   * Creates a combined and deduplicated list of all available options
   * Includes original options from props and dynamically added options from newOptions
   *
   * @returns Array of all available options
   */
  const allOptions = useMemo(() => {
    return [...options, ...newOptions];
  }, [options, newOptions]);


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
          if (!inputValue) {
            return options;
          }

          // Filter options that match the input value
          const filteredOptions = options.filter((option) => {
            const key = getItemKey(option).toLowerCase();
            const searchValue = inputValue.toLowerCase();
            if (key.includes(searchValue)) return true;

            // Convert label to string to ensure we can use includes() on it
            const label = String(getItemLabel(option)).toLowerCase();

            // Return true if either the key or label contains the search value
            return label.includes(searchValue);
          });

          // For freeSolo mode, check if there's an exact match
          if (freeSolo && stringToNewItem && inputValue.length > 0) {
            // Check if there's an exact match in the filtered options
            const hasExactMatch = filteredOptions.some(option => {
              const label = String(getItemLabel(option)).toLowerCase();
              return label.toLowerCase() === inputValue.toLowerCase();
            });

            // If there's no exact match, add a special option to create a new item
            if (!hasExactMatch) {
              // Create a special option with a __isAddOption flag
              const addOption: AddOptionType = {
                __isAddOption: true,
                inputValue,
                // Include properties from stringToNewItem for type compatibility
                ...stringToNewItem(inputValue)
              };

              // Add the special option at the beginning of the filtered options
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
         * Displays a checkbox for multiple selection if showCheckbox is true
         * Uses getItemLabel to render the option label
         * For special add options, displays "Add '[value]'"
         */
        renderOption: (liProps, option, { selected }, ownerState) => {
          // Check if this is a special add option (only in freeSolo mode)
          if (ownerState?.freeSolo && typeof option === 'object' && option !== null && '__isAddOption' in option) {
            // Cast to AddOptionType to access inputValue property
            const addOption = option as unknown as AddOptionType;
            return (
              <li {...liProps} key={`${name}-add-option-${addOption.inputValue}`}>
                Add: '{addOption.inputValue}'
              </li>
            );
          }

          // Regular option rendering
          return (
            <li {...liProps} key={`${name}-option-${getItemKey(option)}`}>
              {/* Show checkbox if explicitly requested or if in multiple selection mode */}
              {(props?.showCheckbox || ownerState?.multiple) && <Checkbox sx={{ marginRight: 1 }} checked={selected} />}
              {typeof option === "string" ? option : getItemLabel(option)}
            </li>
          );
        },

        onChange: (event, value, reason, details) => {
          if (freeSolo && stringToNewItem) {
            // Handle special add option selection
            if (typeof value === 'object' && value !== null && '__isAddOption' in value) {
              // Cast to AddOptionType to access inputValue property
              const addOption = value as unknown as AddOptionType;
              const inputValue = addOption.inputValue;
              const newItem = stringToNewItem(inputValue);

              // Handle multiple selection mode differently
              if (props.multiple) {
                // Get the current field value as an array
                const currentValues = Array.isArray(field.value) ? field.value : [];
                const newValues = [...currentValues, newItem];

                // Apply transformValue if provided
                if (transformValue) {
                  field.onChange(transformValue(newValues));
                } else {
                  field.onChange(newValues);
                }
              } else {
                // Apply transformValue if provided
                if (transformValue) {
                  field.onChange(transformValue(newItem));
                } else {
                  field.onChange(newItem);
                }
              }

              // Add to newOptions if it doesn't exist already
              const itemKey = getItemKey(newItem);
              const itemExists = [...options, ...newOptions].some(
                option => getItemKey(option) === itemKey
              );

              if (!itemExists) {
                setNewOptions([...newOptions, newItem]);
              }
              return;
            }

            // Handle string values (single selection)
            if (typeof value === "string" && value.length > 0) {
              const newItem = stringToNewItem(value);

              // Handle multiple selection mode differently
              if (props.multiple) {
                // Get the current field value as an array
                const currentValues = Array.isArray(field.value) ? field.value : [];
                const newValues = [...currentValues, newItem];

                // Apply transformValue if provided
                if (transformValue) {
                  field.onChange(transformValue(newValues));
                } else {
                  field.onChange(newValues);
                }
              } else {
                // Apply transformValue if provided
                if (transformValue) {
                  field.onChange(transformValue(newItem));
                } else {
                  field.onChange(newItem);
                }
              }

              // Add to newOptions if it doesn't exist already
              const itemKey = getItemKey(newItem);
              const itemExists = [...options, ...newOptions].some(
                option => getItemKey(option) === itemKey
              );

              if (!itemExists) {
                setNewOptions([...newOptions, newItem]);
              }
              return;
            }

            // Handle array values (multiple selection)
            if (Array.isArray(value) && props.multiple) {
              // Convert any string values to objects and handle special add options
              const newValues = value?.map(item => {
                if (typeof item === "string" && item.length > 0) {
                  return stringToNewItem(item);
                }
                if (typeof item === 'object' && item !== null && '__isAddOption' in item) {
                  // Cast to AddOptionType to access inputValue property
                  const addOption = item as unknown as AddOptionType;
                  return stringToNewItem(addOption.inputValue);
                }
                return item;
              }) ?? [];

              // Apply transformValue if provided
              if (transformValue) {
                field.onChange(transformValue(newValues));
              } else {
                field.onChange(newValues);
              }

              // Add any new items to newOptions
              const existingKeys = [...options, ...newOptions].map(option => getItemKey(option));
              const newItems = newValues.filter(
                item => typeof item !== "string" && !existingKeys.includes(getItemKey(item))
              );

              if (newItems.length > 0) {
                setNewOptions([...newOptions, ...newItems]);
              }
              return;
            }
          }

          // Default behavior for non-freeSolo cases
          if (transformValue && value !== null) {
            // Apply transformValue if provided
            field.onChange(transformValue(value as TValue | TValue[]));
          } else {
            // Otherwise use the default onChange handler
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

          if (Array.isArray(typedValue)) {
            return typedValue.map((v, index) => {
              // @ts-expect-error a key is returned, and the linter doesn't pick this up
              const { key, ...chipProps } = getItemProps({ index });

              // For freeSolo values, we need to ensure we're getting the label correctly
              // If v is a string, use it directly, otherwise use getItemLabel
              const label = typeof v === "string" ? v : getItemLabel(v);

              // Get additional chip props based on the value if the function is provided
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

          // For single selection, if the value is a string, use it directly
          // Otherwise, use getItemLabel to extract the label from the object
          // Make sure typedValue is not null or undefined before calling getItemLabel
          return typeof typedValue === "string"
            ? typedValue
            : typedValue
              ? getItemLabel(typedValue as NonNullable<TValue>)
              : "";
        },
        ...autocompleteProps,
      }}
    />
  );
};
