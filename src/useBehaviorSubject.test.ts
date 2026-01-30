import { renderHook, act } from "@testing-library/react";
import { BehaviorSubject } from "rxjs";
import { vi } from "vitest";
import { useBehaviorSubject } from "./useBehaviorSubject";

describe("useBehaviorSubject", () => {
  it("returns the initial value from the BehaviorSubject", () => {
    const subject$ = new BehaviorSubject(42);
    const { result } = renderHook(() => useBehaviorSubject(subject$));
    expect(result.current).toBe(42);
  });

  it("updates when the subject emits a new value", () => {
    const subject$ = new BehaviorSubject(0);
    const { result } = renderHook(() => useBehaviorSubject(subject$));

    expect(result.current).toBe(0);

    act(() => {
      subject$.next(1);
    });
    expect(result.current).toBe(1);

    act(() => {
      subject$.next(2);
    });
    expect(result.current).toBe(2);
  });

  it("returns current value for object types", () => {
    const initial = { count: 0 };
    const subject$ = new BehaviorSubject(initial);
    const { result } = renderHook(() => useBehaviorSubject(subject$));

    expect(result.current).toEqual({ count: 0 });

    act(() => {
      subject$.next({ count: 1 });
    });
    expect(result.current).toEqual({ count: 1 });
  });

  it("unsubscribes when the component unmounts", () => {
    const subject$ = new BehaviorSubject(0);
    const subscribeSpy = vi.spyOn(subject$, "subscribe");
    const { unmount } = renderHook(() => useBehaviorSubject(subject$));

    expect(subscribeSpy).toHaveBeenCalled();
    const subscription = subscribeSpy.mock.results[0]?.value;
    const unsubscribeSpy = subscription
      ? vi.spyOn(subscription, "unsubscribe")
      : vi.fn();

    unmount();

    expect(unsubscribeSpy).toHaveBeenCalled();
    subscribeSpy.mockRestore();
  });

  it("multiple hook instances subscribing to the same subject receive the same value", () => {
    const subject$ = new BehaviorSubject("shared");
    const { result: result1 } = renderHook(() => useBehaviorSubject(subject$));
    const { result: result2 } = renderHook(() => useBehaviorSubject(subject$));

    expect(result1.current).toBe("shared");
    expect(result2.current).toBe("shared");

    act(() => {
      subject$.next("updated");
    });
    expect(result1.current).toBe("updated");
    expect(result2.current).toBe("updated");
  });
});
