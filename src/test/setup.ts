// Import jest-dom to extend expect with DOM-specific matchers
import '@testing-library/jest-dom';

// Import React for JSX support in tests
import React from 'react';

// Make React available globally for tests
// This is useful when testing components that might not explicitly import React
global.React = React;

// Add any additional test setup here
// For example, you might want to:
// - Set up global mocks
// - Configure testing library
// - Set up custom matchers
// - Configure any test environment variables

// Suppress specific console errors/warnings during tests if needed
// const originalConsoleError = console.error;
// console.error = (...args) => {
//   if (/Warning: ReactDOM.render is no longer supported/.test(args[0])) {
//     return;
//   }
//   originalConsoleError(...args);
// };
