import type { AutocompleteOwnerState, AutocompleteRenderValue, ChipTypeMap } from "@mui/material";
import type { ElementType } from "react";

export function getAutocompleteRenderValue<
  TValue,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
  ChipComponent extends ElementType = ChipTypeMap['defaultComponent']
>(value: AutocompleteRenderValue<TValue, Multiple, FreeSolo>, ownerState: AutocompleteOwnerState<TValue, Multiple, DisableClearable, FreeSolo, ChipComponent>) {
  if (ownerState.multiple) {
    if(ownerState?.freeSolo) return value as Array<TValue | string>;
    return value as TValue[];
  } else if (ownerState?.freeSolo) {
    return value as NonNullable<TValue | string>;
  }
  return value as NonNullable<TValue>;
}