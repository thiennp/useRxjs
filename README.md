# useRxJS

A lightweight, hook-based bridge to manage RxJS observable subscriptions and state synchronization within React components.

## Installation

```bash
# pnpm
pnpm add userxjs react rxjs

# npm
npm install userxjs react rxjs

# yarn
yarn add userxjs react rxjs
```

**Peer dependencies:** `react` (^18.0.0 or ^19.0.0), `rxjs` (^7.0.0).

## Usage

### useBehaviorSubject

Subscribe to an RxJS `BehaviorSubject` and get its current value. Updates re-render the component. Built on React's `useSyncExternalStore` for concurrent-safe behavior and no tearing.

```tsx
import { useBehaviorSubject } from "userxjs";
import { BehaviorSubject } from "rxjs";

const count$ = new BehaviorSubject(0);

function Counter() {
  const count = useBehaviorSubject(count$);
  return (
    <div>
      <span>{count}</span>
      <button onClick={() => count$.next(count + 1)}>Increment</button>
    </div>
  );
}
```

### useSubject

Subscribe to an RxJS `Subject`. Returns `undefined` until the first emission, then the latest value.

```tsx
import { useSubject } from "userxjs";
import { Subject } from "rxjs";

const events$ = new Subject<string>();

function Logger() {
  const lastEvent = useSubject(events$);
  return <div>{lastEvent ?? "—"}</div>;
}
```

### useObservable

Subscribe to any RxJS `Observable`. Requires an `initialValue`; returns the latest emitted value once the observable emits.

```tsx
import { useObservable } from "userxjs";
import { interval, map } from "rxjs";

const ticks$ = interval(1000).pipe(map((n) => n + 1));

function Timer() {
  const tick = useObservable(ticks$, 0);
  return <span>{tick}</span>;
}
```

### useReplaySubject

Subscribe to an RxJS `ReplaySubject`. Returns `undefined` until the first emission, then the latest replayed value.

```tsx
import { useReplaySubject } from "userxjs";
import { ReplaySubject } from "rxjs";

const state$ = new ReplaySubject<State>(1);

function App() {
  const state = useReplaySubject(state$);
  return state ? <View state={state} /> : null;
}
```

**Tree-shaking:** To bundle only the hooks you use, use subpaths:

```tsx
import { useBehaviorSubject } from "userxjs/useBehaviorSubject";
import { useSubject } from "userxjs/useSubject";
import { useObservable } from "userxjs/useObservable";
import { useReplaySubject } from "userxjs/useReplaySubject";
```

## Publishing

The GitHub Actions workflow **Publish to npm** runs when you push a version tag (e.g. `v0.0.1`, `v0.0.2`). It runs lint, test, build, then publishes to npm.

1. Bump version and commit: `pnpm version patch` (or minor/major), then commit the version bump.
2. Push the new tag: `git push origin v0.0.2` (replace with your tag).
3. The workflow runs and publishes to npm.

**Required:** Add an npm classic token as the **NPM_TOKEN** secret in the repo (Settings → Secrets and variables → Actions). The token needs “Automation” or “Publish” scope.

## License

ISC
