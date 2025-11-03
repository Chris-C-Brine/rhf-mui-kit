import type { JSX } from "react";
import { FormControl, FormHelperText } from "@mui/material";
import type { FormControlProps } from "@mui/material";
import { useFormContext, type RegisterOptions, type FieldValues, type Path } from "react-hook-form";
import { useFormError } from "../hooks";

/**
 * Props for the RHFHiddenInput component
 */
export interface HiddenElementProps<TFieldValues extends FieldValues> {
  /**
   * Name of the field in the form
   */
  name: Path<TFieldValues>;
  /**
   * Optional validation rules
   */
  rules: RegisterOptions<TFieldValues>;
  /**
   * Props to pass to the FormControl component
   */
  formControlProps?: Omit<FormControlProps, "error">;
}

export const HiddenElement = <TFieldValues extends FieldValues = FieldValues>({
  name,
  rules,
  formControlProps = {},
}: HiddenElementProps<TFieldValues>): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext<TFieldValues>();

  const { error, helperText } = useFormError(errors, name);

  return (
    <FormControl error={error} {...formControlProps}>
      <input type="hidden" {...register(name, rules)} />
      {error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
