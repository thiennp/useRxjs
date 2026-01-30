import { renderHook, act } from "@testing-library/react";
import { AsyncSubject } from "rxjs";
import { vi } from "vitest";
import { useAsyncSubject } from "./useAsyncSubject";

describe("useAsyncSubject", () => {
  it("returns undefined before complete", () => {
    const subject$ = new AsyncSubject<number>();
    const { result } = renderHook(() => useAsyncSubject(subject$));
    expect(result.current).toBeUndefined();

    act(() => {
      subject$.next(1);
      subject$.next(2);
    });
    expect(result.current).toBeUndefined();
  });

  it("returns final value after complete", () => {
    const subject$ = new AsyncSubject<number>();
    const { result } = renderHook(() => useAsyncSubject(subject$));

    act(() => {
      subject$.next(1);
      subject$.next(2);
      subject$.complete();
    });
    expect(result.current).toBe(2);
  });

  it("unsubscribes when the component unmounts", () => {
    const subject$ = new AsyncSubject<number>();
    const subscribeSpy = vi.spyOn(subject$, "subscribe");
    const { unmount } = renderHook(() => useAsyncSubject(subject$));

    expect(subscribeSpy).toHaveBeenCalled();
    const subscription = subscribeSpy.mock.results[0]?.value;
    const unsubscribeSpy = subscription
      ? vi.spyOn(subscription, "unsubscribe")
      : vi.fn();

    unmount();

    expect(unsubscribeSpy).toHaveBeenCalled();
    subscribeSpy.mockRestore();
  });
});
