import type {
  AutocompleteOwnerState,
  AutocompleteRenderValue,
  AutocompleteValue,
  ChipTypeMap,
  TextFieldProps,
} from "@mui/material";
import { ElementType } from "react";

import lodash from "lodash";

const { merge } = lodash;

export function getAutocompleteTypedValue<
  TValue,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
  ChipComponent extends ElementType = ChipTypeMap["defaultComponent"],
>(
  value:
    | AutocompleteRenderValue<TValue, Multiple, FreeSolo>
    | AutocompleteValue<TValue, Multiple, DisableClearable, FreeSolo>,
  ownerState?: AutocompleteOwnerState<TValue, Multiple, DisableClearable, FreeSolo, ChipComponent>,
) {
  if (ownerState?.multiple) {
    if (ownerState?.freeSolo) return value as Array<TValue | string>;
    return value as TValue[];
  } else if (ownerState?.freeSolo) {
    return value as NonNullable<TValue | string>;
  }
  return value as NonNullable<TValue>;
}

// Apply view-only properties directly to the TextFieldElement props
export const getTextElementDisplayProps = <PropType>(
  props: PropType,
  viewOnly = false,
  disableUnderline = false,
) =>
  merge<PropType, Partial<TextFieldProps>>(
    props,
    viewOnly
      ? {
          disabled: true,
          variant: "standard",
          sx: {
            "& .MuiAutocomplete-endAdornment": {
              display: "none",
            },
            // Hide the underline without using slotProps.input.disableUnderline which clears out chips
            ...(disableUnderline && {
              "& .MuiInput-underline:before": { borderBottom: "none" },
              "& .MuiInput-underline:after": { borderBottom: "none" },
              "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
            }),
          },
        }
      : {},
  ) as PropType;
