import { renderHook, act } from "@testing-library/react";
import { ReplaySubject } from "rxjs";
import { vi } from "vitest";
import { useReplaySubject } from "./useReplaySubject";

describe("useReplaySubject", () => {
  it("returns undefined before first emission", () => {
    const subject$ = new ReplaySubject<number>(1);
    const { result } = renderHook(() => useReplaySubject(subject$));
    expect(result.current).toBeUndefined();
  });

  it("updates when the subject emits a value", () => {
    const subject$ = new ReplaySubject<number>(1);
    const { result } = renderHook(() => useReplaySubject(subject$));

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

  it("new subscriber receives replayed value", () => {
    const subject$ = new ReplaySubject<number>(1);
    subject$.next(100);

    const { result } = renderHook(() => useReplaySubject(subject$));
    expect(result.current).toBe(100);
  });

  it("unsubscribes when the component unmounts", () => {
    const subject$ = new ReplaySubject<number>(1);
    const subscribeSpy = vi.spyOn(subject$, "subscribe");
    const { unmount } = renderHook(() => useReplaySubject(subject$));

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
