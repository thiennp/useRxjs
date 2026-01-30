import { useEffect, useRef } from "react";
import type { Observable } from "rxjs";

/** Observer callbacks for useSubscription. */
export interface UseSubscriptionObserver<T> {
  next?: (value: T) => void;
  error?: (err: unknown) => void;
  complete?: () => void;
}

/**
 * Subscribes to an Observable and runs next/error/complete callbacks (side effects only).
 * Unsubscribes on unmount or when the observable reference changes.
 * Does not drive React state — use for logging, analytics, or triggering external logic.
 *
 * @param observable$ - The Observable to subscribe to
 * @param observer - Object with next, error, complete callbacks (all optional)
 */
export function useSubscription<T>(
  observable$: Observable<T> | null | undefined,
  observer: UseSubscriptionObserver<T>
): void {
  const observerRef = useRef(observer);
  observerRef.current = observer;

  useEffect(() => {
    if (observable$ == null) return;
    const subscription = observable$.subscribe({
      next: (v) => observerRef.current.next?.(v),
      error: (e) => observerRef.current.error?.(e),
      complete: () => observerRef.current.complete?.(),
    });
    return () => subscription.unsubscribe();
  }, [observable$]);
}
