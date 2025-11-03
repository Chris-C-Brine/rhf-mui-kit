import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { HiddenElement } from './HiddenElement';

// Wrapper component to provide the form context
const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm({
    defaultValues: {
      hiddenField: 'test-value'
    }
  });
  
  return (
    <FormProvider {...methods}>
      {children}
    </FormProvider>
  );
};

describe('HiddenElement', () => {
  it('renders a hidden input with the correct name', () => {
    render(
      <FormWrapper>
        <HiddenElement 
          name="hiddenField" 
          rules={{ required: 'This field is required' }} 
        />
      </FormWrapper>
    );
    
    // Find the hidden input by its name attribute
    const hiddenInput = document.querySelector('input[name="hiddenField"]');
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput).toHaveAttribute('type', 'hidden');
  });

  it('does not show error message when there is no error', () => {
    render(
      <FormWrapper>
        <HiddenElement 
          name="hiddenField" 
          rules={{ required: 'This field is required' }} 
        />
      </FormWrapper>
    );
    
    // Error message should not be visible
    const errorMessage = screen.queryByText('This field is required');
    expect(errorMessage).not.toBeInTheDocument();
  });

  // Additional tests could be added to test error states
  // This would require triggering validation and form submission
});