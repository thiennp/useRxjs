import { useCallback, useRef, useSyncExternalStore } from "react";
import type { Subject } from "rxjs";

/**
 * Subscribes to an RxJS Subject and returns the latest emitted value.
 * Returns undefined until the first emission. Uses useSyncExternalStore for concurrent-safe updates.
 *
 * @param subject$ - The Subject to subscribe to
 * @returns The latest value emitted by the Subject, or undefined
 */
export function useSubject<T>(subject$: Subject<T>): T | undefined {
  const valueRef = useRef<T | undefined>(undefined);
  const prevSubjectRef = useRef(subject$);
  if (prevSubjectRef.current !== subject$) {
    prevSubjectRef.current = subject$;
    valueRef.current = undefined;
  }

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const subscription = subject$.subscribe((value) => {
        valueRef.current = value;
        onStoreChange();
      });
      return () => subscription.unsubscribe();
    },
    [subject$]
  );

  const getSnapshot = useCallback(() => valueRef.current, []);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
