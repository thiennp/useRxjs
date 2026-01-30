import { useCallback, useRef, useSyncExternalStore } from "react";
import type { Observable } from "rxjs";

/**
 * Subscribes to an RxJS Observable and returns the current value.
 * Uses initialValue until the first emission, then the latest emitted value.
 * Uses useSyncExternalStore for concurrent-safe updates.
 *
 * @param observable$ - The Observable to subscribe to
 * @param initialValue - Value to use before the first emission
 * @returns The latest value from the Observable, or initialValue
 */
export function useObservable<T>(
  observable$: Observable<T>,
  initialValue: T
): T {
  const valueRef = useRef<T>(initialValue);
  const prevObservableRef = useRef(observable$);
  if (prevObservableRef.current !== observable$) {
    prevObservableRef.current = observable$;
    valueRef.current = initialValue;
  }

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const subscription = observable$.subscribe((value) => {
        valueRef.current = value;
        onStoreChange();
      });
      return () => subscription.unsubscribe();
    },
    [observable$]
  );

  const getSnapshot = useCallback(() => valueRef.current, []);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
