import { renderHook, act } from "@testing-library/react";
import { of, Subject } from "rxjs";
import { vi } from "vitest";
import { useObservable } from "./useObservable";

describe("useObservable", () => {
  it("returns initialValue before first emission", () => {
    const subject$ = new Subject<number>();
    const { result } = renderHook(() => useObservable(subject$, 0));
    expect(result.current).toBe(0);
  });

  it("updates when the observable emits a value", () => {
    const subject$ = new Subject<number>();
    const { result } = renderHook(() => useObservable(subject$, -1));

    expect(result.current).toBe(-1);

    act(() => {
      subject$.next(1);
    });
    expect(result.current).toBe(1);

    act(() => {
      subject$.next(2);
    });
    expect(result.current).toBe(2);
  });

  it("works with of() - sync emission", () => {
    const observable$ = of(42);
    const { result } = renderHook(() => useObservable(observable$, 0));
    expect(result.current).toBe(42);
  });

  it("unsubscribes when the component unmounts", () => {
    const subject$ = new Subject<number>();
    const subscribeSpy = vi.spyOn(subject$, "subscribe");
    const { unmount } = renderHook(() => useObservable(subject$, 0));

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
