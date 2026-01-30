import { useCallback, useRef, useSyncExternalStore } from "react";
import type { ReplaySubject } from "rxjs";

/**
 * Subscribes to an RxJS ReplaySubject and returns the latest replayed value.
 * Returns undefined until the first emission. Uses useSyncExternalStore for concurrent-safe updates.
 *
 * @param subject$ - The ReplaySubject to subscribe to
 * @returns The latest value replayed by the ReplaySubject, or undefined
 */
export function useReplaySubject<T>(subject$: ReplaySubject<T>): T | undefined {
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
