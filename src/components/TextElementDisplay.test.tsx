import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { TextElementDisplay } from './TextElementDisplay';
import { ThemeProvider, createTheme } from '@mui/material';
import userEvent from '@testing-library/user-event';

// Mock the TextFieldElement from react-hook-form-mui
vi.mock('react-hook-form-mui', async () => {
  const actual = await vi.importActual('react-hook-form-mui');
  return {
    ...actual,
    TextFieldElement: ({ 
      name, 
      label,
      disabled,
      variant,
      sx,
      control,
      multiline,
      rows,
      ...props 
    }) => {
      // Get the field from the form context
      const { field } = actual.useController({ name, control });

      return (
        <div data-testid="text-field-element">
          <div data-testid="name">{name}</div>
          <div data-testid="label">{label}</div>
          <div data-testid="disabled">{disabled === true ? 'true' : 'false'}</div>
          <div data-testid="variant">{variant}</div>
          <div data-testid="has-sx">{sx ? 'true' : 'false'}</div>
          <div data-testid="multiline">{multiline ? 'true' : 'false'}</div>

          {/* Use textarea for multiline, input for single line */}
          {multiline ? (
            <textarea 
              data-testid="input-field" 
              disabled={disabled}
              rows={rows}
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
            />
          ) : (
            <input 
              data-testid="input-field" 
              disabled={disabled}
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        </div>
      );
    }
  };
});

// Create a theme for testing
const theme = createTheme();

// Wrapper component to provide the form context and theme
const FormWrapper = ({ 
  children, 
  onSubmit = vi.fn(),
  defaultValues = {
    textField: '',
    multilineField: ''
  }
}: { 
  children: React.ReactNode;
  onSubmit?: (data: any) => void;
  defaultValues?: Record<string, any>;
}) => {
  const methods = useForm({
    defaultValues
  });

  return (
    <ThemeProvider theme={theme}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} data-testid="test-form">
          {children}
          <button type="submit" data-testid="submit-button">Submit</button>
        </form>
      </FormProvider>
    </ThemeProvider>
  );
};

describe('TextElementDisplay', () => {
  it('renders with basic props', () => {
    render(
      <FormWrapper>
        <TextElementDisplay
          name="textField" 
          label="Text Field"
        />
      </FormWrapper>
    );

    // Check that the component renders
    expect(screen.getByTestId('text-field-element')).toBeInTheDocument();
    expect(screen.getByTestId('name')).toHaveTextContent('textField');
    expect(screen.getByTestId('label')).toHaveTextContent('Text Field');
    expect(screen.getByTestId('disabled')).toHaveTextContent('false');
  });

  it('renders in view-only mode', () => {
    render(
      <FormWrapper>
        <TextElementDisplay
          name="textField" 
          label="Text Field"
          viewOnly
        />
      </FormWrapper>
    );

    // Check that view-only mode applies the correct props
    expect(screen.getByTestId('disabled')).toHaveTextContent('true');
    expect(screen.getByTestId('variant')).toHaveTextContent('standard');
    expect(screen.getByTestId('has-sx')).toHaveTextContent('true');
  });

  it('renders with disableUnderline in view-only mode', () => {
    render(
      <FormWrapper>
        <TextElementDisplay
          name="textField" 
          label="Text Field"
          viewOnly
          disableUnderline
        />
      </FormWrapper>
    );

    // Check that disableUnderline applies the correct props
    expect(screen.getByTestId('disabled')).toHaveTextContent('true');
    expect(screen.getByTestId('variant')).toHaveTextContent('standard');
    expect(screen.getByTestId('has-sx')).toHaveTextContent('true');
  });

  it('updates and submits values correctly', async () => {
    // Create a mock submit handler to capture form values
    const onSubmitMock = vi.fn();

    // Render the component with the mock submit handler
    render(
      <FormWrapper onSubmit={onSubmitMock}>
        <TextElementDisplay
          name="textField" 
          label="Text Field"
        />
      </FormWrapper>
    );

    // Simulate typing in the input field
    fireEvent.change(screen.getByTestId('input-field'), { target: { value: 'Hello World' } });

    // Submit the form to capture the updated values
    fireEvent.click(screen.getByTestId('submit-button'));

    // Wait for the form submission to complete
    await waitFor(() => {
      // Verify that the submit handler was called
      expect(onSubmitMock).toHaveBeenCalled();

      // Verify that the form value was updated with the new text
      const formValues = onSubmitMock.mock.calls[0][0];
      expect(formValues.textField).toEqual('Hello World');
    });
  });

  it('preserves initial values and submits them correctly', async () => {
    // Create a mock submit handler to capture form values
    const onSubmitMock = vi.fn();

    // Set initial form values
    const initialValues = {
      textField: 'Initial Value'
    };

    // Render the component with initial values and the mock submit handler
    render(
      <FormWrapper onSubmit={onSubmitMock} defaultValues={initialValues}>
        <TextElementDisplay
          name="textField" 
          label="Text Field"
        />
      </FormWrapper>
    );

    // Submit the form without changing the value
    fireEvent.click(screen.getByTestId('submit-button'));

    // Wait for the form submission to complete
    await waitFor(() => {
      // Verify that the submit handler was called
      expect(onSubmitMock).toHaveBeenCalled();

      // Verify that the initial form value was submitted correctly
      const formValues = onSubmitMock.mock.calls[0][0];
      expect(formValues.textField).toEqual('Initial Value');
    });
  });

  it('handles multiline text fields correctly', async () => {
    // Create a mock submit handler to capture form values
    const onSubmitMock = vi.fn();

    // Render the component with the mock submit handler
    render(
      <FormWrapper onSubmit={onSubmitMock}>
        <TextElementDisplay
          name="multilineField" 
          label="Multiline Field"
          multiline
          rows={4}
        />
      </FormWrapper>
    );

    // Simulate typing in the input field
    fireEvent.change(screen.getByTestId('input-field'), { 
      target: { value: 'Line 1\nLine 2\nLine 3' } 
    });

    // Submit the form to capture the updated values
    fireEvent.click(screen.getByTestId('submit-button'));

    // Wait for the form submission to complete
    await waitFor(() => {
      // Verify that the submit handler was called
      expect(onSubmitMock).toHaveBeenCalled();

      // Verify that the form value was updated with the multiline text
      const formValues = onSubmitMock.mock.calls[0][0];
      expect(formValues.multilineField).toEqual('Line 1\nLine 2\nLine 3');
    });
  });
});
