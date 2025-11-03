/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom';

declare global {
  namespace Vi {
    interface Assertion {
      toBeInTheDocument(): Assertion;
      toHaveAttribute(name: string, value?: string): Assertion;
      // Add other matchers as needed
      toBeVisible(): Assertion;
      toBeChecked(): Assertion;
      toBeDisabled(): Assertion;
      toBeEmpty(): Assertion;
      toBeEmptyDOMElement(): Assertion;
      toBeEnabled(): Assertion;
      toBeInvalid(): Assertion;
      toBeRequired(): Assertion;
      toBeValid(): Assertion;
      toContainElement(element: HTMLElement | null): Assertion;
      toContainHTML(html: string): Assertion;
      toHaveClass(...classNames: string[]): Assertion;
      toHaveFocus(): Assertion;
      toHaveFormValues(expectedValues: Record<string, any>): Assertion;
      toHaveStyle(css: string | Record<string, any>): Assertion;
      toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): Assertion;
      toHaveValue(value: string | string[] | number): Assertion;
      toBePartiallyChecked(): Assertion;
    }
  }
}