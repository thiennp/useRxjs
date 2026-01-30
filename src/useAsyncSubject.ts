import { useCallback, useRef, useSyncExternalStore } from "react";
import type { AsyncSubject } from "rxjs";

/**
 * Subscribes to an RxJS AsyncSubject and returns its value.
 * AsyncSubject emits only when it completes; then it emits the last value (Promise-like).
 * Returns undefined until the subject completes.
 *
 * @param subject$ - The AsyncSubject to subscribe to
 * @returns The final value after completion, or undefined
 */
export function useAsyncSubject<T>(subject$: AsyncSubject<T>): T | undefined {
  const valueRef = useRef<T | undefined>(undefined);
  const prevSubjectRef = useRef(subject$);
  if (prevSubjectRef.current !== subject$) {
    prevSubjectRef.current = subject$;
    valueRef.current = undefined;
  }

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const subscription = subject$.subscribe({
        next: (value) => {
          valueRef.current = value;
        },
        complete: () => {
          onStoreChange();
        },
      });
      return () => subscription.unsubscribe();
    },
    [subject$]
  );

  const getSnapshot = useCallback(() => valueRef.current, []);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
