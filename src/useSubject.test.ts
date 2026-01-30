import { renderHook, act } from "@testing-library/react";
import { Subject } from "rxjs";
import { vi } from "vitest";
import { useSubject } from "./useSubject";

describe("useSubject", () => {
  it("returns undefined before first emission", () => {
    const subject$ = new Subject<number>();
    const { result } = renderHook(() => useSubject(subject$));
    expect(result.current).toBeUndefined();
  });

  it("updates when the subject emits a value", () => {
    const subject$ = new Subject<number>();
    const { result } = renderHook(() => useSubject(subject$));

    expect(result.current).toBeUndefined();

    act(() => {
      subject$.next(1);
    });
    expect(result.current).toBe(1);

    act(() => {
      subject$.next(2);
    });
    expect(result.current).toBe(2);
  });

  it("unsubscribes when the component unmounts", () => {
    const subject$ = new Subject<number>();
    const subscribeSpy = vi.spyOn(subject$, "subscribe");
    const { unmount } = renderHook(() => useSubject(subject$));

    expect(subscribeSpy).toHaveBeenCalled();
    const subscription = subscribeSpy.mock.results[0]?.value;
    const unsubscribeSpy = subscription
      ? vi.spyOn(subscription, "unsubscribe")
      : vi.fn();

    unmount();

    expect(unsubscribeSpy).toHaveBeenCalled();
    subscribeSpy.mockRestore();
  });

  it("multiple hook instances receive the same value", () => {
    const subject$ = new Subject<string>();
    const { result: result1 } = renderHook(() => useSubject(subject$));
    const { result: result2 } = renderHook(() => useSubject(subject$));

    expect(result1.current).toBeUndefined();
    expect(result2.current).toBeUndefined();

    act(() => {
      subject$.next("emitted");
    });
    expect(result1.current).toBe("emitted");
    expect(result2.current).toBe("emitted");
  });
});
