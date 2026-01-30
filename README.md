# rxjs-hook

Subscribe to RxJS Observables and Subjects inside React components. No tearing, concurrent-safe (uses `useSyncExternalStore` under the hood).

**If you know RxJS and React:** pick the hook that matches your RxJS type; it returns the latest value (or a callback + stream). No magic.

---

## Install

```bash
pnpm add rxjs-hook react rxjs
# npm install rxjs-hook react rxjs
# yarn add rxjs-hook react rxjs
```

Peer deps: `react` ^18 | ^19, `rxjs` ^7.

---

## Which hook do I use?

| You have…              | Use this hook              | You get…                          |
|------------------------|----------------------------|-----------------------------------|
| `BehaviorSubject<T>`   | `useBehaviorSubject`       | `T` (always defined)              |
| `Subject<T>`           | `useSubject`               | `T` or `undefined`                |
| `ReplaySubject<T>`     | `useReplaySubject`         | `T` or `undefined`                |
| `AsyncSubject<T>`      | `useAsyncSubject`          | `T` or `undefined` (after complete)|
| `Observable<T>`        | `useObservable`            | `T` (you pass `initialValue`)     |
| Side effects only      | `useSubscription`          | nothing (next/error/complete)    |
| Turn callbacks → stream | `useObservableCallback`    | `[callback, Subject<T>]`           |

---

## State hooks (subscribe → current value)

These hooks subscribe to a stream and return the latest value. Component re-renders when the stream emits.

### useBehaviorSubject

`BehaviorSubject` always has a current value. Hook returns it.

```tsx
import { useBehaviorSubject } from "rxjs-hook";
import { BehaviorSubject } from "rxjs";

const count$ = new BehaviorSubject(0);

function Counter() {
  const count = useBehaviorSubject(count$);
  return <button onClick={() => count$.next(count + 1)}>{count}</button>;
}
```

### useSubject

`Subject` has no initial value. Hook returns `undefined` until the first emission, then the latest value.

```tsx
import { useSubject } from "rxjs-hook";
import { Subject } from "rxjs";

const events$ = new Subject<string>();

function Log() {
  const last = useSubject(events$);
  return <div>{last ?? "—"}</div>;
}
```

### useReplaySubject

`ReplaySubject` replays N values to new subscribers. Hook returns the latest replayed value (or `undefined` before any emission).

```tsx
import { useReplaySubject } from "rxjs-hook";
import { ReplaySubject } from "rxjs";

const state$ = new ReplaySubject<State>(1);

function App() {
  const state = useReplaySubject(state$);
  return state ? <View state={state} /> : null;
}
```

### useAsyncSubject

`AsyncSubject` emits only when it completes, and only the last value (Promise-like). Hook returns that value after `complete()`, otherwise `undefined`.

```tsx
import { useAsyncSubject } from "rxjs-hook";
import { AsyncSubject } from "rxjs";

const result$ = new AsyncSubject<Data>();
fetch(url).then((r) => r.json()).then((d) => { result$.next(d); result$.complete(); });

function DataView() {
  const data = useAsyncSubject(result$);
  return data ? <pre>{JSON.stringify(data)}</pre> : <span>Loading…</span>;
}
```

### useObservable

Any `Observable<T>`. You must pass an `initialValue`; the hook returns it until the first emission, then the latest value.

```tsx
import { useObservable } from "rxjs-hook";
import { interval, map } from "rxjs";

const ticks$ = interval(1000).pipe(map((n) => n + 1));

function Timer() {
  const tick = useObservable(ticks$, 0);
  return <span>{tick}</span>;
}
```

---

## Side effects: useSubscription

Subscribe to an Observable and run `next` / `error` / `complete`. Does **not** drive React state. Use for logging, analytics, or triggering external logic.

```tsx
import { useSubscription } from "rxjs-hook";
import { events$ } from "./events";

function Logger() {
  useSubscription(events$, {
    next: (e) => console.log(e),
    error: (err) => console.error(err),
    complete: () => console.log("done"),
  });
  return null;
}
```

Pass `null` or `undefined` as the first argument to “disable” the subscription.

---

## Events → stream: useObservableCallback

Get a **callback** and a **Subject**. Call the callback (e.g. from `onChange`); values go into the Subject. Subscribe or `.pipe()` on it (debounce, map, etc.).

```tsx
import { useObservableCallback, useSubscription } from "rxjs-hook";
import { debounceTime } from "rxjs";

function Search() {
  const [onChange, query$] = useObservableCallback<string>();

  useSubscription(query$.pipe(debounceTime(300)), {
    next: (q) => console.log("search:", q),
  });

  return <input onChange={(e) => onChange(e.target.value)} />;
}
```

Or combine with `useObservable` if you want the latest value in state:

```tsx
const [onChange, query$] = useObservableCallback<string>();
const query = useObservable(query$.pipe(debounceTime(300)), "");
return <input value={query} onChange={(e) => onChange(e.target.value)} />;
```

---

## Tree-shaking

Import from subpaths so only the hooks you use are bundled:

```tsx
import { useBehaviorSubject } from "rxjs-hook/useBehaviorSubject";
import { useObservableCallback } from "rxjs-hook/useObservableCallback";
import { useSubscription } from "rxjs-hook/useSubscription";
// etc.
```

---

## Publishing

Push a version tag to run the **Publish to npm** workflow (lint → test → build → publish):

```bash
pnpm version patch && git push && git push origin v0.0.3
```

Repo secret **NPM_TOKEN** (npm classic token with Publish scope) is required.

---

## License

ISC
