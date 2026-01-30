import { useCallback, useRef } from "react";
import { Subject } from "rxjs";

/**
 * Returns a stable callback and a Subject. Call the callback to push values; subscribe to the Subject for the stream.
 * Use this to turn React events (or any callback API) into an Observable you can pipe (debounceTime, map, etc.).
 *
 * @returns [callback, subject$] — call callback(value) to emit; subscribe to subject$ for the stream
 */
export function useObservableCallback<T>(): [(value: T) => void, Subject<T>] {
  const subjectRef = useRef<Subject<T> | null>(null);
  if (subjectRef.current === null) {
    subjectRef.current = new Subject<T>();
  }
  const subject$ = subjectRef.current;

  const callback = useCallback(
    (value: T) => {
      subject$.next(value);
    },
    // subject$ is from ref and stable; empty deps intentional
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return [callback, subject$];
}
