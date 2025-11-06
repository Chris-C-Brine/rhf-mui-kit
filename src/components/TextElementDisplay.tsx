import { TextFieldElement, type TextFieldElementProps } from "react-hook-form-mui";
import { type FieldPath, type FieldValues } from "react-hook-form";
import { useMemo } from "react";
import { getTextElementDisplayProps } from "../utils";

export type TextElementDisplayProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = TextFieldElementProps<TFieldValues, TName> & Viewable;

/**
 * A form component that displays a text field with view-only capabilities.
 * Extends TextFieldElement with view-only functionality.
 *
 * @template TFieldValues - The type of the form values
 * @template TName - The type of the field name
 *
 * @returns A React component for text input with view-only support
 */
export const TextElementDisplay = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  viewOnly,
  disableUnderline,
  ...props
}: TextElementDisplayProps<TFieldValues, TName>) => {

  const adjustedProps = useMemo(
    () => getTextElementDisplayProps(props, viewOnly, disableUnderline),
    [props, viewOnly, disableUnderline],
  );

  return <TextFieldElement {...adjustedProps} />;
};

type Viewable = {
  viewOnly?: boolean;
  disableUnderline?: boolean;
};
