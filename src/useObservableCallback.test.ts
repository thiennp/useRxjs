import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useObservableCallback } from "./useObservableCallback";

describe("useObservableCallback", () => {
  it("returns a callback and a Subject", () => {
    const { result } = renderHook(() => useObservableCallback<number>());
    const [callback, subject$] = result.current;

    expect(typeof callback).toBe("function");
    expect(subject$).toBeDefined();
    expect(typeof subject$.subscribe).toBe("function");
  });

  it("callback emits values to the Subject", () => {
    const { result } = renderHook(() => useObservableCallback<number>());
    const [callback, subject$] = result.current;

    const next = vi.fn();
    subject$.subscribe(next);

    act(() => {
      callback(1);
    });
    expect(next).toHaveBeenCalledWith(1);

    act(() => {
      callback(2);
    });
    expect(next).toHaveBeenCalledWith(2);
  });

  it("callback and Subject are stable across re-renders", () => {
    const { result, rerender } = renderHook(() =>
      useObservableCallback<string>()
    );
    const [callback1, subject$1] = result.current;

    rerender();
    const [callback2, subject$2] = result.current;

    expect(callback1).toBe(callback2);
    expect(subject$1).toBe(subject$2);
  });
});
