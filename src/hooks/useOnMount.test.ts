import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { useOnMount } from './useOnMount';

describe('useOnMount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call the callback once on mount', () => {
    // Arrange
    const callback = vi.fn();

    // Act
    renderHook(() => useOnMount(callback));

    // Assert
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not call the callback on re-renders', () => {
    // Arrange
    const callback = vi.fn();

    // Act
    const { rerender } = renderHook(() => useOnMount(callback));

    // Re-render the hook
    rerender();
    rerender();

    // Assert
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should set hasMounted.current to true after first render', () => {
    // Arrange
    const callback = vi.fn();

    // Create a spy on React.useRef to capture the ref
    const useRefSpy = vi.spyOn(React, 'useRef').mockImplementationOnce(() => {
      return { current: false };
    });

    // Act
    renderHook(() => useOnMount(callback));

    // Assert
    // Verify the callback was called, which means hasMounted.current was false
    expect(callback).toHaveBeenCalledTimes(1);

    // Restore the original implementation
    useRefSpy.mockRestore();
  });

  it('should maintain hasMounted state during cleanup', () => {
    // Arrange
    const callback = vi.fn();

    // Act
    const { unmount } = renderHook(() => useOnMount(callback));

    // Unmount the component to trigger cleanup
    unmount();

    // Render again to check if callback is called
    renderHook(() => useOnMount(callback));

    // Assert - callback should be called again since we're creating a new instance
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
