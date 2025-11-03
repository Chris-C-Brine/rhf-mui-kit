import { AutocompleteElement, type AutocompleteElementProps } from "react-hook-form-mui";
import { type ChipTypeMap } from "@mui/material";
import type { FieldPath, FieldValues } from "react-hook-form";
import { type ElementType, useMemo } from "react";
import { merge } from "lodash";

export type DisplayAutocompleteProps<
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
> &
  Viewable;

export const AutocompleteDisplayElement = <
  TValue,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
  ChipComponent extends ElementType = ChipTypeMap["defaultComponent"],
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  viewOnly,
  disableUnderline,
  textFieldProps,
  autocompleteProps,
  ...props
}: DisplayAutocompleteProps<
  TValue,
  Multiple,
  DisableClearable,
  FreeSolo,
  ChipComponent,
  TFieldValues,
  TName
>) => {
  const autocompleteAdjustedProps: DisplayAutocompleteProps<
    TValue,
    Multiple,
    DisableClearable,
    FreeSolo,
    ChipComponent,
    TFieldValues,
    TName
  >['autocompleteProps'] = useMemo(
    () =>
      merge(
        {
          readOnly: viewOnly,
          disableClearable: viewOnly,
          disabled: viewOnly,
          slotProps: {
            input: { disableUnderline },
            chip: {
              disabled: false,
            },
          },
        },
        autocompleteProps,
        viewOnly
          ? {
              sx: {
                ".MuiAutocomplete-endAdornment": {
                  display: "none",
                },
                ".MuiAutocomplete-tag": {
                  opacity: "1 !important"
                },
              },
            }
          : {},
      ),
    [autocompleteProps, viewOnly, disableUnderline],
  );

  const textFieldAdjustedProps = useMemo(
    () => merge(viewOnly ? { variant: "standard" } : {}, textFieldProps),
    [viewOnly, textFieldProps],
  );

  return (
    <AutocompleteElement
      {...props}
      autocompleteProps={autocompleteAdjustedProps}
      textFieldProps={textFieldAdjustedProps}
    />
  );
};

type Viewable = {
  viewOnly?: boolean;
  disableUnderline?: boolean;
};
