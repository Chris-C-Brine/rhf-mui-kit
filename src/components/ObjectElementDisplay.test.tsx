import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { ObjectElementDisplay } from './ObjectElementDisplay';
import { ThemeProvider, createTheme } from '@mui/material';
import React from 'react';
import { AutocompleteValue, AutocompleteChangeReason, AutocompleteInputChangeReason } from '@mui/material/Autocomplete';

// Define a test item type
interface TestItem {
  id: string;
  name: string;
}

// Mock the AutocompleteElementDisplay
vi.mock('./AutocompleteElementDisplay', () => ({
  AutocompleteElementDisplay: <
    TValue,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined
  >({
    name, 
    options, 
    autocompleteProps,
    control,
    viewOnly,
    ...props
  }: {
    name: string;
    options: TValue[];
    autocompleteProps?: {
      onChange?: (
        event: React.SyntheticEvent,
        value: AutocompleteValue<TValue, Multiple, DisableClearable, FreeSolo>,
        reason: AutocompleteChangeReason,
        details?: any
      ) => void;
      onInputChange?: (
        event: React.SyntheticEvent,
        value: string,
        reason: AutocompleteInputChangeReason
      ) => void;
      renderValue?: (
        value: AutocompleteValue<TValue, Multiple, DisableClearable, FreeSolo>,
        getItemProps: (params: { index: number }) => any,
        ownerState: any
      ) => React.ReactNode;
      freeSolo?: boolean;
      [key: string]: any;
    };
    // control?: any;
    viewOnly?: boolean;
    multiple?: Multiple;
    [key: string]: any;
  }) => {
    // Call the onChange handler to simulate selection if provided
    const simulateChange = <T,>(value: T) => {
      if (autocompleteProps?.onChange) {
        autocompleteProps.onChange(
          { preventDefault: vi.fn() } as unknown as React.SyntheticEvent, 
          value as any, 
          'createOption',
          undefined
        );
      }
    };

    // Call the onInputChange handler to simulate typing if provided
    const simulateInputChange = (value: string) => {
      if (autocompleteProps?.onInputChange) {
        autocompleteProps.onInputChange(
          { preventDefault: vi.fn() } as unknown as React.SyntheticEvent,
          value,
          'input'
        );
      }
    };

    // Simulate creating a new free solo item
    const simulateFreeSoloCreate = (inputValue: string) => {
      // First update the input value
      simulateInputChange(inputValue);

      // Then trigger the change with the input value as a string
      // The component should convert this to an object using stringToNewItem
      simulateChange(inputValue);
    };

    // Mock the getItemProps function for renderValue
    const getItemProps = ({ index }: { index: number }) => ({
      key: `mock-key-${index}`,
      className: 'mock-chip-class'
    });

    // Define the type for ownerState
    interface OwnerState {
      multiple?: boolean;
      freeSolo?: boolean;
      [key: string]: any;
    }

    // Mock the ownerState for renderValue
    const ownerState: OwnerState = {
      multiple: props.multiple,
      freeSolo: autocompleteProps?.freeSolo
    };

    // Get the rendered value if renderValue is provided
    let renderedValue = null;
    if (autocompleteProps?.renderValue) {
      // For testing, we'll use the actual form value if available
      // Otherwise, fall back to a mock value
      const mockValue = props.multiple 
        ? ["New Free Solo Item"] 
        : "New Free Solo Item";

      // Use the actual form value if it's available in the test
      const testValue = (window as any).testValue;
      const valueToRender = testValue !== undefined ? testValue : mockValue;

      renderedValue = autocompleteProps.renderValue(
        valueToRender as any,
        getItemProps,
        ownerState
      );
    }

    return (
      <div data-testid="autocomplete-display-element">
        <div data-testid="name">{name}</div>
        <div data-testid="options-count">{options.length}</div>
        <div data-testid="is-option-equal-to-value">
          {autocompleteProps?.isOptionEqualToValue ? 'function-provided' : 'no-function'}
        </div>
        <div data-testid="filter-options">
          {autocompleteProps?.filterOptions ? 'function-provided' : 'no-function'}
        </div>
        <div data-testid="free-solo">{autocompleteProps?.freeSolo?.toString()}</div>
        <div data-testid="view-only">{viewOnly ? 'true' : 'false'}</div>

        {/* Display the rendered value for testing */}
        <div data-testid="rendered-value">
          {renderedValue}
        </div>

        {/* Button to simulate selecting an existing option */}
        <button 
          data-testid="select-existing-option" 
          onClick={() => simulateChange(options[0])}
          disabled={viewOnly}
        >
          Select Existing Option
        </button>

        {/* Input field for free solo text entry */}
        <input 
          data-testid="input-field" 
          onChange={(e) => simulateInputChange(e.target.value)}
          disabled={viewOnly}
          readOnly={viewOnly}
        />

        {/* Button to simulate creating a new free solo item */}
        <button 
          data-testid="create-free-solo-item" 
          onClick={() => simulateFreeSoloCreate("New Free Solo Item")}
          disabled={viewOnly}
        >
          Create Free Solo Item
        </button>
      </div>
    );
  }
}));

// Create a theme for testing
const theme = createTheme();

// Sample test items
const testItems: TestItem[] = [
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' },
  { id: '3', name: 'Item 3' }
];

// Define the type for form values
interface TestFormValues {
  objectField?: TestItem | null;
  multipleObjectField?: TestItem[];
  freeSoloField?: TestItem | null;
  multipleFreeSoloField?: TestItem[];
  [key: string]: any; // Allow for additional fields
}

// Wrapper component to provide the form context and theme
const FormWrapper = ({ 
  children, 
  onSubmit = vi.fn(),
  defaultValues = {
    objectField: null,
    multipleObjectField: [],
    freeSoloField: null
  }
}: { 
  children: React.ReactNode;
  onSubmit?: (data: TestFormValues) => void;
  defaultValues?: Partial<TestFormValues>;
}) => {
  const methods = useForm<TestFormValues>({
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

describe('ObjectElementDisplay', () => {
  it('renders with basic props', () => {
    render(
      <FormWrapper>
        <ObjectElementDisplay
          name="objectField" 
          options={testItems}
          getItemKey={(item) => item ? item.id : 'null'}
          getItemLabel={(item) => item ? item.name : 'None'}
        />
      </FormWrapper>
    );

    // Check that the component renders
    expect(screen.getByTestId('autocomplete-display-element')).toBeInTheDocument();
    expect(screen.getByTestId('name')).toHaveTextContent('objectField');
    expect(screen.getByTestId('options-count')).toHaveTextContent('3');
    expect(screen.getByTestId('is-option-equal-to-value')).toHaveTextContent('function-provided');
    expect(screen.getByTestId('filter-options')).toHaveTextContent('function-provided');
  });

  it('handles freeSolo mode correctly - updates values', async () => {
    // Create a mock submit handler to capture form values
    const onSubmitMock = vi.fn();

    // Render the component with the mock submit handler
    render(
      <FormWrapper onSubmit={onSubmitMock}>
        <ObjectElementDisplay
          name="freeSoloField" 
          options={testItems}
          getItemKey={(item) => item ? (typeof item === 'string' ? item : item.id) : 'null'}
          getItemLabel={(item) => item ? (typeof item === 'string' ? item : item.name) : 'None'}
          freeSolo={true}
          stringToNewItem={(value) => ({ id: `new-${value}`, name: value })}
        />
      </FormWrapper>
    );

    // Check that freeSolo is enabled
    expect(screen.getByTestId('free-solo')).toHaveTextContent('true');

    // Simulate creating a new free solo item
    fireEvent.click(screen.getByTestId('create-free-solo-item'));

    // Submit the form to capture the updated values
    fireEvent.click(screen.getByTestId('submit-button'));

    // Wait for the form submission to complete
    await waitFor(() => {
      // Verify that the submit handler was called
      expect(onSubmitMock).toHaveBeenCalled();

      // Verify that the form value was updated with the new free solo item
      // The stringToNewItem function should have converted "New Free Solo Item" to an object
      const formValues = onSubmitMock.mock.calls[0][0];
      expect(formValues.freeSoloField).toEqual({
        id: 'new-New Free Solo Item',
        name: 'New Free Solo Item'
      });
    });
  });

  it('handles freeSolo mode correctly - submits values', async () => {
    // Create a mock submit handler to capture form values
    const onSubmitMock = vi.fn();

    // Set initial form values
    const initialValues = {
      freeSoloField: { id: 'initial-value', name: 'Initial Value' }
    };

    // Render the component with initial values and the mock submit handler
    render(
      <FormWrapper onSubmit={onSubmitMock} defaultValues={initialValues}>
        <ObjectElementDisplay
          name="freeSoloField" 
          options={testItems}
          getItemKey={(item) => item ? (typeof item === 'string' ? item : item.id) : 'null'}
          getItemLabel={(item) => item ? (typeof item === 'string' ? item : item.name) : 'None'}
          freeSolo={true}
          stringToNewItem={(value) => ({ id: `new-${value}`, name: value })}
        />
      </FormWrapper>
    );

    // Check that freeSolo is enabled
    expect(screen.getByTestId('free-solo')).toHaveTextContent('true');

    // Submit the form without changing the value
    fireEvent.click(screen.getByTestId('submit-button'));

    // Wait for the form submission to complete
    await waitFor(() => {
      // Verify that the submit handler was called
      expect(onSubmitMock).toHaveBeenCalled();

      // Verify that the initial form value was submitted correctly
      const formValues = onSubmitMock.mock.calls[0][0];
      expect(formValues.freeSoloField).toEqual({
        id: 'initial-value',
        name: 'Initial Value'
      });
    });

    // Reset the mock to test with a new free solo value
    onSubmitMock.mockReset();

    // Simulate creating a new free solo item
    fireEvent.click(screen.getByTestId('create-free-solo-item'));

    // Submit the form again
    fireEvent.click(screen.getByTestId('submit-button'));

    // Wait for the form submission to complete
    await waitFor(() => {
      // Verify that the submit handler was called again
      expect(onSubmitMock).toHaveBeenCalled();

      // Verify that the updated form value was submitted correctly
      const formValues = onSubmitMock.mock.calls[0][0];
      expect(formValues.freeSoloField).toEqual({
        id: 'new-New Free Solo Item',
        name: 'New Free Solo Item'
      });
    });
  });

  it('handles multiple selection with freeSolo mode correctly', async () => {
    // Create a mock submit handler to capture form values
    const onSubmitMock = vi.fn();

    // Set initial form values with multiple items
    const initialValues = {
      multipleFreeSoloField: [
        { id: 'item-1', name: 'Item One' },
        { id: 'item-2', name: 'Item Two' }
      ]
    };

    // Render the component with initial values and the mock submit handler
    render(
      <FormWrapper onSubmit={onSubmitMock} defaultValues={initialValues}>
        <ObjectElementDisplay
          name="multipleFreeSoloField" 
          options={testItems}
          getItemKey={(item) => item ? (typeof item === 'string' ? item : item.id) : 'null'}
          getItemLabel={(item) => item ? (typeof item === 'string' ? item : item.name) : 'None'}
          freeSolo={true}
          multiple={true}
          stringToNewItem={(value) => ({ id: `new-${value}`, name: value })}
        />
      </FormWrapper>
    );

    // Check that freeSolo is enabled
    expect(screen.getByTestId('free-solo')).toHaveTextContent('true');

    // Submit the form without changing the value
    fireEvent.click(screen.getByTestId('submit-button'));

    // Wait for the form submission to complete
    await waitFor(() => {
      // Verify that the submit handler was called
      expect(onSubmitMock).toHaveBeenCalled();

      // Verify that the initial form values were submitted correctly
      const formValues = onSubmitMock.mock.calls[0][0];
      expect(formValues.multipleFreeSoloField).toEqual([
        { id: 'item-1', name: 'Item One' },
        { id: 'item-2', name: 'Item Two' }
      ]);
    });

    // Reset the mock to test with a new free solo value
    onSubmitMock.mockReset();

    // Simulate creating a new free solo item
    fireEvent.click(screen.getByTestId('create-free-solo-item'));

    // Submit the form again
    fireEvent.click(screen.getByTestId('submit-button'));

    // Wait for the form submission to complete
    await waitFor(() => {
      // Verify that the submit handler was called again
      expect(onSubmitMock).toHaveBeenCalled();

      // Verify that the updated form values include the new free solo item
      // In multiple mode, the new item should be added to the existing array
      const formValues = onSubmitMock.mock.calls[0][0];
      expect(formValues.multipleFreeSoloField).toEqual([
        { id: 'item-1', name: 'Item One' },
        { id: 'item-2', name: 'Item Two' },
        { id: 'new-New Free Solo Item', name: 'New Free Solo Item' }
      ]);
    });
  });

  it('handles multiple selection mode', () => {
    render(
      <FormWrapper>
        <ObjectElementDisplay
          name="multipleObjectField" 
          options={testItems}
          getItemKey={(item) => item ? item.id : 'null'}
          getItemLabel={(item) => item ? item.name : 'None'}
          multiple={true}
        />
      </FormWrapper>
    );

    // Check that the component renders with the correct name
    expect(screen.getByTestId('name')).toHaveTextContent('multipleObjectField');
  });

  it('applies custom chip props when provided', () => {
    render(
      <FormWrapper>
        <ObjectElementDisplay
          name="multipleObjectField" 
          options={testItems}
          getItemKey={(item) => item ? item.id : 'null'}
          getItemLabel={(item) => item ? item.name : 'None'}
          multiple={true}
          getChipProps={({ value }) => ({ 
            color: value.id === '1' ? 'primary' : 'default'
          })}
        />
      </FormWrapper>
    );

    // In a real test, we would check that the chip has the correct color
    // But since we're mocking the component, we can only check that it renders
    expect(screen.getByTestId('autocomplete-display-element')).toBeInTheDocument();
  });

  it('renders in view-only mode', () => {
    render(
      <FormWrapper>
        <ObjectElementDisplay
          name="objectField" 
          options={testItems}
          getItemKey={(item) => item ? item.id : 'null'}
          getItemLabel={(item) => item ? item.name : 'None'}
          viewOnly
        />
      </FormWrapper>
    );

    // Check that view-only mode is enabled
    expect(screen.getByTestId('view-only')).toHaveTextContent('true');

    // Verify that interactive elements are disabled
    const selectButton = screen.getByTestId('select-existing-option');
    expect(selectButton).toBeDisabled();

    const inputField = screen.getByTestId('input-field');
    expect(inputField).toBeDisabled();
    expect(inputField).toHaveAttribute('readOnly');

    const createButton = screen.getByTestId('create-free-solo-item');
    expect(createButton).toBeDisabled();
  });

  it('preserves and submits values correctly in view-only mode', async () => {
    // Create a mock submit handler to capture form values
    const onSubmitMock = vi.fn();

    // Set initial form values
    const initialValues = {
      objectField: { id: 'view-only-item', name: 'View Only Item' }
    };

    // Render the component with initial values and the mock submit handler
    render(
      <FormWrapper onSubmit={onSubmitMock} defaultValues={initialValues}>
        <ObjectElementDisplay
          name="objectField" 
          options={testItems}
          getItemKey={(item) => item ? item.id : 'null'}
          getItemLabel={(item) => item ? item.name : 'None'}
          viewOnly
        />
      </FormWrapper>
    );

    // Check that view-only mode is enabled
    expect(screen.getByTestId('view-only')).toHaveTextContent('true');

    // Submit the form without changing the value
    fireEvent.click(screen.getByTestId('submit-button'));

    // Wait for the form submission to complete
    await waitFor(() => {
      // Verify that the submit handler was called
      expect(onSubmitMock).toHaveBeenCalled();

      // Verify that the initial form value was submitted correctly
      const formValues = onSubmitMock.mock.calls[0][0];
      expect(formValues.objectField).toEqual({
        id: 'view-only-item',
        name: 'View Only Item'
      });
    });
  });

  it('handles multiple selection in view-only mode correctly', async () => {
    // Create a mock submit handler to capture form values
    const onSubmitMock = vi.fn();

    // Set initial form values with multiple items
    const initialValues = {
      multipleObjectField: [
        { id: 'item-1', name: 'Item One' },
        { id: 'item-2', name: 'Item Two' }
      ]
    };

    // Render the component with initial values and the mock submit handler
    render(
      <FormWrapper onSubmit={onSubmitMock} defaultValues={initialValues}>
        <ObjectElementDisplay
          name="multipleObjectField" 
          options={testItems}
          getItemKey={(item) => item ? item.id : 'null'}
          getItemLabel={(item) => item ? item.name : 'None'}
          multiple={true}
          viewOnly
        />
      </FormWrapper>
    );

    // Check that view-only mode is enabled
    expect(screen.getByTestId('view-only')).toHaveTextContent('true');

    // Submit the form without changing the value
    fireEvent.click(screen.getByTestId('submit-button'));

    // Wait for the form submission to complete
    await waitFor(() => {
      // Verify that the submit handler was called
      expect(onSubmitMock).toHaveBeenCalled();

      // Verify that the initial form values were submitted correctly
      const formValues = onSubmitMock.mock.calls[0][0];
      expect(formValues.multipleObjectField).toEqual([
        { id: 'item-1', name: 'Item One' },
        { id: 'item-2', name: 'Item Two' }
      ]);
    });
  });

  it('displays freeSolo value correctly in view-only mode', async () => {
    // Create a mock submit handler to capture form values
    const onSubmitMock = vi.fn();

    // Set initial form values with a freeSolo value that's not in the options
    const freeSoloValue = { id: 'free-solo-value', name: 'Free Solo Value' };
    const initialValues = {
      freeSoloField: freeSoloValue
    };

    // Render the component with initial values and the mock submit handler
    render(
      <FormWrapper onSubmit={onSubmitMock} defaultValues={initialValues}>
        <ObjectElementDisplay
          name="freeSoloField" 
          options={testItems} // freeSoloValue is not in this list
          getItemKey={(item) => item ? (typeof item === 'string' ? item : item.id) : 'null'}
          getItemLabel={(item) => item ? (typeof item === 'string' ? item : item.name) : 'None'}
          freeSolo={true}
          stringToNewItem={(value) => ({ id: `new-${value}`, name: value })}
          viewOnly
        />
      </FormWrapper>
    );

    // Check that view-only mode is enabled
    expect(screen.getByTestId('view-only')).toHaveTextContent('true');

    // Check that freeSolo is enabled
    expect(screen.getByTestId('free-solo')).toHaveTextContent('true');

    // Submit the form without changing the value
    fireEvent.click(screen.getByTestId('submit-button'));

    // Wait for the form submission to complete
    await waitFor(() => {
      // Verify that the submit handler was called
      expect(onSubmitMock).toHaveBeenCalled();

      // Verify that the freeSolo value was submitted correctly
      const formValues = onSubmitMock.mock.calls[0][0];
      expect(formValues.freeSoloField).toEqual(freeSoloValue);
    });
  });
  it('renders freeSolo chip with correct inner text in single selection mode', () => {
    // Create a mock submit handler to capture form values
    const onSubmitMock = vi.fn();

    // Render the component with freeSolo enabled
    render(
      <FormWrapper onSubmit={onSubmitMock}>
        <ObjectElementDisplay
          name="freeSoloField" 
          options={testItems}
          getItemKey={(item) => item ? (typeof item === 'string' ? item : item.id) : 'null'}
          getItemLabel={(item) => item ? (typeof item === 'string' ? item : item.name) : 'None'}
          freeSolo={true}
          stringToNewItem={(value) => ({ id: `new-${value}`, name: value })}
        />
      </FormWrapper>
    );

    // Check that freeSolo is enabled
    expect(screen.getByTestId('free-solo')).toHaveTextContent('true');

    // Get the rendered value element
    const renderedValueElement = screen.getByTestId('rendered-value');

    // Check that the rendered value contains the expected text
    // Since we're mocking with "New Free Solo Item", that's what should be displayed
    expect(renderedValueElement).toHaveTextContent('New Free Solo Item');
  });

  it('renders freeSolo chips with correct inner text in multiple selection mode', () => {
    // Create a mock submit handler to capture form values
    const onSubmitMock = vi.fn();

    // Render the component with freeSolo and multiple selection enabled
    render(
      <FormWrapper onSubmit={onSubmitMock}>
        <ObjectElementDisplay
          name="multipleFreeSoloField" 
          options={testItems}
          getItemKey={(item) => item ? (typeof item === 'string' ? item : item.id) : 'null'}
          getItemLabel={(item) => item ? (typeof item === 'string' ? item : item.name) : 'None'}
          freeSolo={true}
          multiple={true}
          stringToNewItem={(value) => ({ id: `new-${value}`, name: value })}
        />
      </FormWrapper>
    );

    // Check that freeSolo is enabled
    expect(screen.getByTestId('free-solo')).toHaveTextContent('true');

    // Get the rendered value element
    const renderedValueElement = screen.getByTestId('rendered-value');

    // Check that the rendered value contains the expected text
    // Since we're mocking with ["New Free Solo Item"] for multiple mode,
    // the chip should display "New Free Solo Item"
    expect(renderedValueElement).toHaveTextContent('New Free Solo Item');
  });

  it('renders default value correctly when not in default options', async () => {
    // Create a mock submit handler to capture form values
    const onSubmitMock = vi.fn();

    // Set initial form values with a value that's not in the options
    const defaultValue = { id: 'not-in-options', name: 'Not In Options' };
    const initialValues = {
      objectField: defaultValue
    };

    // Set the test value for the mock to use
    (window as any).testValue = defaultValue;

    // Render the component with initial values and the mock submit handler
    render(
      <FormWrapper onSubmit={onSubmitMock} defaultValues={initialValues}>
        <ObjectElementDisplay
          name="objectField" 
          options={testItems} // defaultValue is not in this list
          getItemKey={(item) => item ? item.id : 'null'}
          getItemLabel={(item) => item ? item.name : 'None'}
        />
      </FormWrapper>
    );

    // Submit the form without changing the value
    fireEvent.click(screen.getByTestId('submit-button'));

    // Wait for the form submission to complete
    await waitFor(() => {
      // Verify that the submit handler was called
      expect(onSubmitMock).toHaveBeenCalled();

      // Verify that the default value was submitted correctly
      const formValues = onSubmitMock.mock.calls[0][0];
      expect(formValues.objectField).toEqual(defaultValue);
    });

    // Get the rendered value element
    const renderedValueElement = screen.getByTestId('rendered-value');

    // Check that the rendered value contains the expected text
    // The component should display the label of the default value
    expect(renderedValueElement).toHaveTextContent('Not In Options');
  });

  it('updates multiple values correctly in viewOnly mode after rendering', async () => {
    // Create a mock submit handler to capture form values
    const onSubmitMock = vi.fn();

    // Set initial form values with multiple items
    const initialValues = {
      multipleObjectField: [
        { id: 'item-1', name: 'Item One' },
        { id: 'item-2', name: 'Item Two' }
      ]
    };

    // Set the test value for the mock to use
    (window as any).testValue = initialValues.multipleObjectField;

    // Create a component with a form that can update its values
    const TestComponent = () => {
      const methods = useForm<TestFormValues>({
        defaultValues: initialValues
      });

      // Function to update the form values
      const updateValues = () => {
        const newValues = [
          ...initialValues.multipleObjectField,
          { id: 'item-3', name: 'Item Three' }
        ];
        methods.setValue('multipleObjectField', newValues);

        // Update the test value for the mock to use
        (window as any).testValue = newValues;
      };

      return (
        <ThemeProvider theme={theme}>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmitMock)} data-testid="test-form">
              <ObjectElementDisplay
                name="multipleObjectField" 
                options={testItems} // Some items are not in this list
                getItemKey={(item) => item ? item.id : 'null'}
                getItemLabel={(item) => item ? item.name : 'None'}
                multiple={true}
                viewOnly
              />
              <button type="button" onClick={updateValues} data-testid="update-button">
                Update Values
              </button>
              <button type="submit" data-testid="submit-button">Submit</button>
            </form>
          </FormProvider>
        </ThemeProvider>
      );
    };

    // Render the test component
    render(<TestComponent />);

    // Verify initial rendering
    let renderedValueElement = screen.getByTestId('rendered-value');
    expect(renderedValueElement).toHaveTextContent('Item One');
    expect(renderedValueElement).toHaveTextContent('Item Two');

    // Update the form values
    fireEvent.click(screen.getByTestId('update-button'));

    // Verify that the rendered value is updated with the new item
    await waitFor(() => {
      renderedValueElement = screen.getByTestId('rendered-value');
      expect(renderedValueElement).toHaveTextContent('Item One');
      expect(renderedValueElement).toHaveTextContent('Item Two');
      expect(renderedValueElement).toHaveTextContent('Item Three');
    });

    // Submit the form to verify the updated values
    fireEvent.click(screen.getByTestId('submit-button'));

    // Wait for the form submission to complete
    await waitFor(() => {
      // Verify that the submit handler was called
      expect(onSubmitMock).toHaveBeenCalled();

      // Verify that the updated form values were submitted correctly
      const formValues = onSubmitMock.mock.calls[0][0];
      expect(formValues.multipleObjectField).toEqual([
        { id: 'item-1', name: 'Item One' },
        { id: 'item-2', name: 'Item Two' },
        { id: 'item-3', name: 'Item Three' }
      ]);
    });
  });
  it('applies transformValue function to single selection value', async () => {
    // Create a mock submit handler to capture form values
    const onSubmitMock = vi.fn();

    // Create a mock transformValue function
    const transformValueMock = vi.fn((value) => {
      if (!value) return null;
      return {
        ...value,
        transformed: true
      };
    });

    // Render the component with the transformValue prop
    render(
      <FormWrapper onSubmit={onSubmitMock}>
        <ObjectElementDisplay
          name="objectField" 
          options={testItems}
          getItemKey={(item) => item ? item.id : 'null'}
          getItemLabel={(item) => item ? item.name : 'None'}
          transformValue={transformValueMock}
        />
      </FormWrapper>
    );

    // Simulate selecting an existing option
    fireEvent.click(screen.getByTestId('select-existing-option'));

    // Submit the form
    fireEvent.click(screen.getByTestId('submit-button'));

    // Wait for the form submission to complete
    await waitFor(() => {
      // Verify that the transformValue function was called
      expect(transformValueMock).toHaveBeenCalledWith(testItems[0]);

      // Verify that the transformed value was submitted
      const formValues = onSubmitMock.mock.calls[0][0];
      expect(formValues.objectField).toEqual({
        ...testItems[0],
        transformed: true
      });
    });
  });

  it.skip('applies transformValue function to multiple selection values', async () => {
    // Create a mock submit handler to capture form values
    const onSubmitMock = vi.fn();

    // Create a mock transformValue function for array values
    const transformValueMock = vi.fn((values) => {
      if (!values || !Array.isArray(values)) return [];
      return values.map(value => ({
        ...value,
        transformed: true
      }));
    });

    // Set initial form values with multiple items
    const initialValues = {
      multipleObjectField: [testItems[0], testItems[1]]
    };

    // Manually apply the transform to the expected result
    // This simulates what would happen if transformValue was called
    const transformedValues = initialValues.multipleObjectField.map(value => ({
      ...value,
      transformed: true
    }));

    // Add the third item that will be added by clicking "Select Existing Option"
    const expectedValues = [
      ...transformedValues,
      { ...testItems[0], transformed: true }
    ];

    // Render the component with the transformValue prop
    render(
      <FormWrapper onSubmit={onSubmitMock} defaultValues={initialValues}>
        <ObjectElementDisplay
          name="multipleObjectField" 
          options={testItems}
          getItemKey={(item) => item ? item.id : 'null'}
          getItemLabel={(item) => item ? item.name : 'None'}
          multiple={true}
          transformValue={transformValueMock}
        />
      </FormWrapper>
    );

    // Simulate selecting an existing option
    fireEvent.click(screen.getByTestId('select-existing-option'));

    // Submit the form
    fireEvent.click(screen.getByTestId('submit-button'));

    // Wait for the form submission to complete
    await waitFor(() => {
      // Verify that the transformValue function was called at least once
      expect(transformValueMock).toHaveBeenCalled();

      // Verify that the transformed values were submitted
      const formValues = onSubmitMock.mock.calls[0][0];

      // The exact structure of the form values depends on how the mock is implemented
      // But we expect each item to have the transformed: true property
      expect(formValues.multipleObjectField.length).toBe(3);
      formValues.multipleObjectField.forEach(item => {
        expect(item).toHaveProperty('transformed', true);
      });
    });
  });

  it('applies transformValue function to freeSolo values', async () => {
    // Create a mock submit handler to capture form values
    const onSubmitMock = vi.fn();

    // Create a mock transformValue function
    const transformValueMock = vi.fn((value) => {
      if (!value) return null;
      return {
        ...value,
        transformed: true
      };
    });

    // Render the component with freeSolo and transformValue props
    render(
      <FormWrapper onSubmit={onSubmitMock}>
        <ObjectElementDisplay
          name="freeSoloField" 
          options={testItems}
          getItemKey={(item) => item ? (typeof item === 'string' ? item : item.id) : 'null'}
          getItemLabel={(item) => item ? (typeof item === 'string' ? item : item.name) : 'None'}
          freeSolo={true}
          stringToNewItem={(value) => ({ id: `new-${value}`, name: value })}
          transformValue={transformValueMock}
        />
      </FormWrapper>
    );

    // Simulate creating a new free solo item
    fireEvent.click(screen.getByTestId('create-free-solo-item'));

    // Submit the form
    fireEvent.click(screen.getByTestId('submit-button'));

    // Wait for the form submission to complete
    await waitFor(() => {
      // Verify that the transformValue function was called with the new item
      expect(transformValueMock).toHaveBeenCalled();

      // The first argument should be the new item created by stringToNewItem
      const newItem = { id: 'new-New Free Solo Item', name: 'New Free Solo Item' };
      expect(transformValueMock.mock.calls[0][0]).toEqual(newItem);

      // Verify that the transformed value was submitted
      const formValues = onSubmitMock.mock.calls[0][0];
      expect(formValues.freeSoloField).toEqual({
        ...newItem,
        transformed: true
      });
    });
  });
});
