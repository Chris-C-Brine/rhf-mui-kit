import { AutocompleteElement, type AutocompleteElementProps } from "react-hook-form-mui";
import { type ChipTypeMap } from "@mui/material";
import type { FieldPath, FieldValues } from "react-hook-form";
import { type ElementType, useMemo } from "react";
import lodash from "lodash";
import { getTextElementDisplayProps } from "../utils";

const { merge } = lodash;

export type AutocompleteElementDisplayProps<
  TValue,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
  ChipComponent extends ElementType = ChipTypeMap["defaultComponent"],
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = AutocompleteElementProps<
  TValue,
  Multiple,
  DisableClearable,
  FreeSolo,
  ChipComponent,
  TFieldValues,
  TName
> & {
  viewOnly?: boolean;
  disableUnderline?: boolean;
}

export const AutocompleteElementDisplay = <
  TValue,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
  ChipComponent extends ElementType = ChipTypeMap["defaultComponent"],
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  viewOnly = undefined as boolean | undefined,
  disableUnderline,
  textFieldProps,
  autocompleteProps,
  transform,
  ...props
}: AutocompleteElementDisplayProps<
  TValue,
  Multiple,
  DisableClearable,
  FreeSolo,
  ChipComponent,
  TFieldValues,
  TName
>) => {
  const autocompleteAdjustedProps: AutocompleteElementDisplayProps<
    TValue,
    Multiple,
    DisableClearable,
    FreeSolo,
    ChipComponent,
    TFieldValues,
    TName
  >["autocompleteProps"] = useMemo(
    () =>
      merge<
        AutocompleteElementDisplayProps<TValue, Multiple, DisableClearable, FreeSolo, ChipComponent, TFieldValues, TName>["autocompleteProps"],
        AutocompleteElementDisplayProps<TValue, Multiple, DisableClearable, FreeSolo, ChipComponent, TFieldValues, TName>["autocompleteProps"],
        AutocompleteElementDisplayProps<TValue, Multiple, DisableClearable, FreeSolo, ChipComponent, TFieldValues, TName>["autocompleteProps"]
      >(
        {
          readOnly: viewOnly,
          disableClearable: autocompleteProps?.disableClearable || viewOnly as DisableClearable,
          disabled: viewOnly,

        },
        autocompleteProps,
        viewOnly
          ? {
              sx: {
                ".MuiAutocomplete-tag": {
                  opacity: "1 !important",
                },
              },
            }
          : {},
      ),
    [autocompleteProps, viewOnly],
  );

  const transformAdjusted = useMemo(() => {
    if (!autocompleteProps?.freeSolo || typeof transform?.input === "function") {
      return transform;
    }

    const isOptionEqualToValue = (option: TValue, value: TValue): boolean => {
      if (typeof autocompleteProps?.isOptionEqualToValue === "function") {
        return autocompleteProps.isOptionEqualToValue(option, value);
      }
      const optionKey =
        option && typeof option === "object" && "id" in option ? (option as { id: unknown }).id : option;
      const valueKey =
        value && typeof value === "object" && "id" in value ? (value as { id: unknown }).id : value;
      return optionKey === valueKey;
    };

    const matchOptionByValue = (currentValue: TValue) =>
      props.options.find((option) => {
        if (props.matchId && option && typeof option === "object" && "id" in option) {
          return (option as { id: unknown }).id === currentValue;
        }
        return isOptionEqualToValue(option, currentValue);
      });

    return {
      ...transform,
      input: (newValue: unknown) => {
        if (props.multiple) {
          const values = Array.isArray(newValue) ? newValue : [];
          return values.map((currentValue) => {
            if (typeof currentValue === "string") return currentValue;
            return matchOptionByValue(currentValue as TValue) ?? currentValue;
          }) as any;
        }
        if (typeof newValue === "string") return newValue as any;
        return (matchOptionByValue(newValue as TValue) ?? newValue ?? null) as any;
      },
    };
  }, [autocompleteProps, transform, props.matchId, props.multiple, props.options]);

  const textFieldAdjustedProps= useMemo(
    () => getTextElementDisplayProps(textFieldProps, viewOnly, disableUnderline),
    [textFieldProps, viewOnly, disableUnderline],
  );

  return (
    <AutocompleteElement
      autocompleteProps={autocompleteAdjustedProps}
      textFieldProps={textFieldAdjustedProps}
      transform={transformAdjusted}
      {...props}
    />
  );
};


