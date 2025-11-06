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

  const textFieldAdjustedProps= useMemo(
    () => getTextElementDisplayProps(textFieldProps, viewOnly, disableUnderline),
    [textFieldProps, viewOnly, disableUnderline],
  );

  return (
    <AutocompleteElement
      autocompleteProps={autocompleteAdjustedProps}
      textFieldProps={textFieldAdjustedProps}
      {...props}
    />
  );
};


