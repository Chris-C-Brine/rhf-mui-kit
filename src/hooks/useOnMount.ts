// src/hooks/useOnMount.ts
import { useEffect, useRef } from "react";

/**
 * Runs a provided callback function once on the first component mount.
 *
 * @param callback - The function to run on first mount.
 */
export function useOnMount(callback: () => void): void {
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      callback();
      hasMounted.current = true;
    }

    // Cleanup to prevent callback logic from running during cleanup
    return () => {
      hasMounted.current = true;
    };
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

