import { type ElementType, ReactNode, useMemo, useState } from "react";
import { Checkbox, Chip, Typography, type ChipProps, type ChipTypeMap } from "@mui/material";
import type { FieldPath, FieldValues } from "react-hook-form";
import {
  AutocompleteDisplayElement,
  type DisplayAutocompleteProps,
} from "./AutocompleteDisplayElement";
import { getAutocompleteRenderValue } from "../utils";
import { useController } from "react-hook-form-mui";
import { useOnMount } from "../hooks";
import { omit } from "lodash";

/**
 * Extends DisplayAutocompleteProps with additional properties for handling object values.
 *
 * @template TValue - The type of the option values
 * @template Multiple - Boolean flag indicating if multiple selections are allowed
 * @template DisableClearable - Boolean flag indicating if clearing the selection is disabled
 * @template FreeSolo - Boolean flag indicating if free text input is allowed
 * @template ChipComponent - The component type used for rendering chips in multiple selection mode
 * @template TFieldValues - The type of the form values
 * @template TName - The type of the field name
 */
export type DisplayObjectCompleteProps<
  TValue,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
  ChipComponent extends ElementType = ChipTypeMap["defaultComponent"],
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = DisplayAutocompleteProps<
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
};

/**
 * A form component that displays a searchable dropdown for selecting object values.
 * Extends AutocompleteDisplayElement with object-specific functionality.
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
export const ObjectDisplayElement = <
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
  name,
  freeSolo,
  control,
  ...props
}: DisplayObjectCompleteProps<
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
   * State for the current text input in free-solo mode
   */
  const [freeSoloValue, setFreeSoloValue] = useState("");

  /**
   * State for storing dynamically added options that aren't in the original options list
   */
  const [newOptions, setNewOptions] = useState<TValue[]>([]);

  /**
   * On component mount, handle initial field values that aren't in the options
   * This is important for loading saved data that might reference items not in the current options
   */
  useOnMount(() => {
    if (!freeSolo || !field.value) return;

    // Handle both single and multiple selection modes
    const fieldValues: TValue[] = Array.isArray(field.value) ? field.value : [field.value];

    // Filter out values that are already in options
    const newFieldOptions = fieldValues.filter((value) => {
      // Skip string values as they're handled differently
      if (typeof value === "string") return false;

      // Check if this value exists in options
      return !options.some((option) => getItemKey(option) === getItemKey(value));
    });

    // Add new values to newOptions if any were found
    if (newFieldOptions.length > 0) setNewOptions(newFieldOptions);
  });

  /**
   * Creates a new item from the current free-solo text input
   * Returns undefined if:
   * - Free-solo mode is disabled
   * - No stringToNewItem converter is provided
   * - Input is empty
   * - An item with the same key already exists in options or newOptions
   *
   * @returns The new item created from the free-solo input, or undefined
   */
  const freeSoloItem = useMemo(() => {
    if (!freeSolo || !stringToNewItem || !freeSoloValue.length) return undefined;
    const item = stringToNewItem(freeSoloValue);
    const itemKey = getItemKey(item);
    if (options.some((option) => getItemKey(option) === itemKey)) return undefined;
    if (newOptions.some((option) => getItemKey(option) === itemKey)) return undefined;
    return item;
  }, [stringToNewItem, freeSoloValue, newOptions, freeSolo, options, getItemKey]);

  /**
   * Creates a combined and deduplicated list of all available options
   * Includes:
   * - Original options from props
   * - Dynamically added options from newOptions
   * - Current free-solo item if it exists
   *
   * @returns Array of all available options with duplicates removed
   */
  const allOptions = useMemo(() => {
    if (!freeSolo) return options;

    // Combine all options and deduplicate by key
    const combinedOptions = [...options, ...newOptions];
    if (freeSoloItem) combinedOptions.push(freeSoloItem);

    // Deduplicate using getItemKey
    const uniqueKeys = new Set();
    return combinedOptions.filter((option) => {
      const key = getItemKey(option);
      if (uniqueKeys.has(key)) return false;
      uniqueKeys.add(key);
      return true;
    });
  }, [options, newOptions, freeSolo, freeSoloItem, getItemKey]);

  // console.log({ allOptions });

  return (
    <AutocompleteDisplayElement
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
         * Checks if the option key contains the input value (case-insensitive)
         */
        filterOptions: (options, { inputValue }) =>
          options.filter((option) =>
            getItemKey(option).toLowerCase().includes(inputValue.toLowerCase()),
          ),
        freeSolo, // Allowed to enter own string value
        autoComplete: true,
        autoHighlight: true, // The first option is highlighted by default
        openOnFocus: true, // Opens the menu when tabbed into

        /**
         * Custom rendering for each option in the dropdown list
         * Displays a checkbox for multiple selection if showCheckbox is true
         * Uses getItemLabel to render the option label
         */
        renderOption: (liProps, option, { selected }) => (
          <li {...liProps} key={`${name}-option-${getItemKey(option)}`}>
            {props?.showCheckbox && <Checkbox sx={{ marginRight: 1 }} checked={selected} />}
            {typeof option === "string" ? option : getItemLabel(option)}
          </li>
        ),

        /**
         * Handles changes to the selected value(s)
         * In free-solo mode, adds the new item to newOptions when selected
         * Delegates to the original onChange handler if provided
         */
        onChange: (event, value, reason, details) => {
          if (freeSolo && freeSoloItem) {
            if (stringToNewItem == undefined) {
              throw new Error("Must implement stringToNewItem with freeSolo!");
            }
            setNewOptions((prev) => [...prev, freeSoloItem]);
            setFreeSoloValue("");
          }

          autocompleteProps?.onChange?.(event, value, reason, details);
        },

        /**
         * Handles changes to the input text
         * Updates freeSoloValue state with the current input
         * Delegates to the original onInputChange handler if provided
         */
        onInputChange: (event, value, reason) => {
          // event.preventDefault();
          setFreeSoloValue(value);

          // Call the original onInputChange if it exists
          autocompleteProps?.onInputChange?.(event, value, reason);
        },

        /**
         * Custom rendering for the selected value(s)
         * For multiple selection, renders a Chip for each selected value
         * For single selection, renders the value as text
         * Uses getItemLabel to render the value labels
         */
        renderValue: (value, getItemProps, ownerState) => {
          const typedValue = getAutocompleteRenderValue(value, ownerState);

          if (Array.isArray(typedValue)) {
            return typedValue.map((v, index) => {
              // @ts-expect-error a key is returned, and the linter doesn't pick this up
              const { key, ...chipProps } = getItemProps({ index });
              // const { key, ...rawChipProps } = getItemProps({ index });
              // const chipProps = omit(rawChipProps, "onDelete");

              const label = typeof v === "string" ? v : getItemLabel(v);

              // Get additional chip props based on the value if the function is provided
              const valueSpecificProps =
                typeof v !== "string" && getChipProps ? getChipProps({ value: v, index }) : {};
              return (
                <Chip
                  key={`${name}-chip-${key}`}
                  label={label}
                  {...valueSpecificProps}
                  {...chipProps}
                />
              );
            });
          }

          // @ts-expect-error a key is returned, and the linter doesn't pick this up
          // const { key, ...rawChipProps } = getItemProps({ index: 0 });
          const { key, ...rawChipProps } = getItemProps({ index: 0 });
          const itemProps = omit(rawChipProps, "onDelete");
          return (
            <Typography
              component={"span"}
              key={`${name}-value-${key}`}
              color={"text.primary"}
              {...(props?.viewOnly ? omit(itemProps, "disabled") : itemProps)}
            >
              {typeof typedValue === "string" ? typedValue : getItemLabel(typedValue)}
            </Typography>
          );
        },
        ...autocompleteProps,
      }}
    />
  );
};
