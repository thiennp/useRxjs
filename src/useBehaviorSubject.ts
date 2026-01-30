import { useSyncExternalStore } from "react";
import type { BehaviorSubject } from "rxjs";

/**
 * Subscribes to an RxJS BehaviorSubject and returns its current value.
 * Uses React's useSyncExternalStore for concurrent-safe updates and no tearing.
 *
 * @param subject$ - The BehaviorSubject to subscribe to
 * @returns The current value of the BehaviorSubject
 */
export function useBehaviorSubject<T>(subject$: BehaviorSubject<T>): T {
  const subscribe = (onStoreChange: () => void) => {
    const subscription = subject$.subscribe(onStoreChange);
    return () => subscription.unsubscribe();
  };
  const getSnapshot = () => subject$.getValue();
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
