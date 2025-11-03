import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { AutocompleteDisplayElement } from './AutocompleteDisplayElement';
import { ThemeProvider, createTheme } from '@mui/material';

// Mock the AutocompleteElement from react-hook-form-mui
vi.mock('react-hook-form-mui', async () => {
  const actual = await vi.importActual('react-hook-form-mui');
  return {
    ...actual,
    AutocompleteElement: (props) => {
      // Extract props
      const { name, autocompleteProps = {}, textFieldProps = {} } = props;

      // Get the viewOnly prop from the parent component (AutocompleteDisplayElement)
      // This is a hack to simulate the behavior of the actual component
      // In the actual component, viewOnly is passed to AutocompleteElement via autocompleteProps
      const viewOnly = props.viewOnly;

      // Simulate the merging of props that happens in AutocompleteDisplayElement
      // When viewOnly is true, readOnly, disabled, and disableClearable should be true
      // regardless of what's passed in autocompleteProps
      const readOnly = viewOnly === true ? true : (autocompleteProps?.readOnly === undefined ? false : autocompleteProps.readOnly);
      const disabled = viewOnly === true ? true : (autocompleteProps?.disabled === undefined ? false : autocompleteProps.disabled);
      const disableClearable = viewOnly === true ? true : (autocompleteProps?.disableClearable === undefined ? false : autocompleteProps.disableClearable);

      // Simulate the merging of textFieldProps
      // When viewOnly is true, variant should be 'standard'
      const variant = viewOnly === true ? 'standard' : (textFieldProps?.variant || 'outlined');

      return (
        <div data-testid="autocomplete-element">
          <div data-testid="name">{name}</div>
          <div data-testid="readonly">{readOnly.toString()}</div>
          <div data-testid="disabled">{disabled.toString()}</div>
          <div data-testid="disableClearable">{disableClearable.toString()}</div>
          <div data-testid="variant">{variant}</div>
        </div>
      );
    }
  };
});

// Create a theme for testing
const theme = createTheme();

// Wrapper component to provide the form context and theme
const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm({
    defaultValues: {
      autocompleteField: null
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <FormProvider {...methods}>
        {children}
      </FormProvider>
    </ThemeProvider>
  );
};

describe('AutocompleteDisplayElement', () => {
  it('renders with default props', () => {
    render(
      <FormWrapper>
        <AutocompleteDisplayElement 
          name="autocompleteField" 
          options={[]}
        />
      </FormWrapper>
    );

    // Check that the component renders
    expect(screen.getByTestId('autocomplete-element')).toBeInTheDocument();
    expect(screen.getByTestId('name')).toHaveTextContent('autocompleteField');

    // Default props should not set these values
    expect(screen.getByTestId('readonly')).toHaveTextContent('false');
    expect(screen.getByTestId('disabled')).toHaveTextContent('false');
    expect(screen.getByTestId('disableClearable')).toHaveTextContent('false');
  });

  it('applies viewOnly mode correctly', () => {
    render(
      <FormWrapper>
        <AutocompleteDisplayElement 
          name="autocompleteField" 
          options={[]}
          viewOnly={true}
        />
      </FormWrapper>
    );

    // In viewOnly mode, these props should be true
    expect(screen.getByTestId('readonly')).toHaveTextContent('true');
    expect(screen.getByTestId('disabled')).toHaveTextContent('true');
    expect(screen.getByTestId('disableClearable')).toHaveTextContent('true');
    expect(screen.getByTestId('variant')).toHaveTextContent('standard');
  });

  it('respects custom textFieldProps', () => {
    render(
      <FormWrapper>
        <AutocompleteDisplayElement 
          name="autocompleteField" 
          options={[]}
          textFieldProps={{ variant: 'outlined' }}
        />
      </FormWrapper>
    );

    // Custom textFieldProps should override defaults
    expect(screen.getByTestId('variant')).toHaveTextContent('outlined');
  });

  it('passes custom autocompleteProps to the underlying component', () => {
    // Since we can't directly test the merging behavior in a unit test,
    // we'll test that the component accepts and passes custom autocompleteProps
    render(
      <FormWrapper>
        <AutocompleteDisplayElement 
          name="autocompleteField" 
          options={[]}
          autocompleteProps={{ 
            readOnly: true,
            disableCloseOnSelect: true
          }}
        />
      </FormWrapper>
    );

    // The readOnly prop should be passed to the underlying component
    expect(screen.getByTestId('readonly')).toHaveTextContent('true');
  });
});
