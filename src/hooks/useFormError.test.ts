import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFormError } from './useFormError';
import { FieldErrors } from 'react-hook-form';

describe('useFormError', () => {
  it('should return error=false and empty helperText when no error exists', () => {
    // Arrange
    const errors: FieldErrors = {};
    const fieldName = 'testField';

    // Act
    const { result } = renderHook(() => useFormError(errors, fieldName));

    // Assert
    expect(result.current.error).toBe(false);
    expect(result.current.helperText).toBe('');
  });

  it('should return error=true and the error message when an error exists', () => {
    // Arrange
    const errorMessage = 'This field is required';
    const errors: FieldErrors = {
      testField: {
        type: 'required',
        message: errorMessage
      }
    };
    const fieldName = 'testField';

    // Act
    const { result } = renderHook(() => useFormError(errors, fieldName));

    // Assert
    expect(result.current.error).toBe(true);
    expect(result.current.helperText).toBe(errorMessage);
  });

  it('should handle nested field names correctly', () => {
    // Arrange
    const errorMessage = 'Invalid email format';
    const errors: FieldErrors = {
      user: {
        email: {
          type: 'pattern',
          message: errorMessage
        }
      }
    };
    const fieldName = 'user.email';

    // Act
    const { result } = renderHook(() => useFormError(errors, fieldName));

    // Assert
    expect(result.current.error).toBe(true);
    expect(result.current.helperText).toBe(errorMessage);
  });

  it('should handle errors without a message property', () => {
    // Arrange
    const errors: FieldErrors = {
      testField: {
        type: 'required'
      }
    };
    const fieldName = 'testField';

    // Act
    const { result } = renderHook(() => useFormError(errors, fieldName));

    // Assert
    expect(result.current.error).toBe(true);
    expect(result.current.helperText).toBe('');
  });
});