import { renderHook, act } from "@testing-library/react";
import { Subject } from "rxjs";
import { vi } from "vitest";
import { useSubscription } from "./useSubscription";

describe("useSubscription", () => {
  it("calls next when observable emits", () => {
    const subject$ = new Subject<number>();
    const next = vi.fn();
    renderHook(() => useSubscription(subject$, { next }));

    act(() => {
      subject$.next(1);
    });
    expect(next).toHaveBeenCalledWith(1);

    act(() => {
      subject$.next(2);
    });
    expect(next).toHaveBeenCalledWith(2);
  });

  it("calls error when observable errors", () => {
    const subject$ = new Subject<number>();
    const error = vi.fn();
    renderHook(() => useSubscription(subject$, { error }));

    act(() => {
      subject$.error(new Error("test"));
    });
    expect(error).toHaveBeenCalledWith(expect.any(Error));
  });

  it("calls complete when observable completes", () => {
    const subject$ = new Subject<number>();
    const complete = vi.fn();
    renderHook(() => useSubscription(subject$, { complete }));

    act(() => {
      subject$.complete();
    });
    expect(complete).toHaveBeenCalled();
  });

  it("unsubscribes on unmount", () => {
    const subject$ = new Subject<number>();
    const next = vi.fn();
    const { unmount } = renderHook(() => useSubscription(subject$, { next }));

    unmount();
    act(() => {
      subject$.next(1);
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("handles null observable", () => {
    const next = vi.fn();
    expect(() =>
      renderHook(() => useSubscription(null, { next }))
    ).not.toThrow();
    expect(next).not.toHaveBeenCalled();
  });
});
