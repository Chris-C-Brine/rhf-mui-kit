# RHF-MUI-KIT
[![npm version](https://img.shields.io/npm/v/@chris-c-brine/rhf-mui-kit.svg)](https://www.npmjs.com/package/@chris-c-brine/rhf-mui-kit)
[![License: AAL](https://img.shields.io/badge/License-AAL-blue.svg)](https://github.com/Chris-C-Brine/rhf-mui-kit/blob/main/LICENSE)

A specialized component library that extends React Hook Form with Material UI integration, providing enhanced form components for complex data handling and display modes.

## Features

- **View Mode Support**: All components support a read-only view mode with appropriate styling
- **Complex Object Handling**: Work with object values in autocomplete fields with proper type safety
- **Form Validation**: Integrated error handling with Material UI components
- **TypeScript Support**: Fully typed components and hooks for better developer experience

## Components

- **AutocompleteDisplayElement**: Enhanced autocomplete with view-only mode support
- **ObjectDisplayElement**: Autocomplete for complex objects with key/label extraction
- **HiddenElement**: Hidden form field with validation support

## Hooks

- **useFormError**: Extract field errors from React Hook Form
- **useOnMount**: Run code only on the component's first mount

## Installation

```bash
npm install @chris-c-brine/rhf-mui-kit
```

## Requirements

- React 17+
- Material UI 5+
- React Hook Form 7+
- React Hook Form MUI 7+

## Basic Usage

```tsx
import { ObjectDisplayElement } from '@chris-c-brine/rhf-mui-kit';
import { FormContainer } from 'react-hook-form-mui';

// Example with object values
const MyForm = () => (
  <FormContainer defaultValues={{ user: null }}>
    <ObjectDisplayElement
      name="user"
      label="Select User"
      options={users}
      multiple
      showChekbox
      getItemKey={(user) => user?.id || ''}
      getItemLabel={(user) => `${user?.lastName}, ${user?.firstName}`.trim()}
      required
    />
  </FormContainer>
);
```

## Development

### Setup

```bash
git clone https://github.com/chris-c-brine/rhf-mui-kit.git
cd rhf-mui-kit
npm install
```

### Build

```bash
npm run build
```

### Development Server

```bash
npm run dev
```

### Testing

```bash
npm run test
```

## License

[AAL](LICENSE) © Christopher C. Brine
