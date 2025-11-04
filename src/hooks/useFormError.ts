import { FieldError, FieldErrors, FieldValues } from 'react-hook-form';
import lodash from 'lodash';
const { get } = lodash;

/**
 * A hook to get the error message for a field from react-hook-form
 * @param errors The errors object from react-hook-form
 * @param name The name of the field (supports dot notation for nested fields)
 * @returns An object with error and helperText properties
 */
export function useFormError<T extends FieldValues>(
  errors: FieldErrors<T>,
  name: string
): { error: boolean; helperText: string } {
  // Get the error for the field, supporting nested paths with dot notation
  const fieldError = get(errors, name) as FieldError | undefined;

  // Return error state and helper text
  return {
    error: !!fieldError,
    helperText: fieldError?.message || '',
  };
}
