# useRxJS

A lightweight, hook-based bridge to manage RxJS observable subscriptions and state synchronization within React components.

## Installation

```bash
# pnpm
pnpm add use-rxjs react rxjs

# npm
npm install use-rxjs react rxjs

# yarn
yarn add use-rxjs react rxjs
```

**Peer dependencies:** `react` (^18.0.0 or ^19.0.0), `rxjs` (^7.0.0).

## Usage

### useBehaviorSubject

Subscribe to an RxJS `BehaviorSubject` and get its current value. Updates re-render the component. Built on React's `useSyncExternalStore` for concurrent-safe behavior and no tearing.

```tsx
import { useBehaviorSubject } from "use-rxjs";
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

**Tree-shaking:** To bundle only this hook, use the subpath:

```tsx
import { useBehaviorSubject } from "use-rxjs/useBehaviorSubject";
```

## License

ISC
