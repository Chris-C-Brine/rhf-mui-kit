import { FieldError, FieldErrors, FieldValues } from 'react-hook-form';

/**
 * A hook to get the error message for a field from react-hook-form
 * @param errors The errors object from react-hook-form
 * @param name The name of the field
 * @returns An object with error and helperText properties
 */
export function useFormError<T extends FieldValues>(
  errors: FieldErrors<T>,
  name: string
): { error: boolean; helperText: string } {
  // Get the error for the field
  const fieldError = errors[name] as FieldError | undefined;

  // Return error state and helper text
  return {
    error: !!fieldError,
    helperText: fieldError?.message || '',
  };
}