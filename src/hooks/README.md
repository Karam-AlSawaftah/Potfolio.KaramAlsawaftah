# hooks/

Custom React hooks that are shared across multiple components go here.

Examples of what belongs here:
- `useLocalStorage.ts` — read/write a value in localStorage with reactive updates
- `useDebounce.ts` — debounce a rapidly-changing value
- `useMediaQuery.ts` — respond to CSS breakpoints in React

Hooks that are only used by one component stay colocated with that component
(e.g., `src/boot/useBootSequence.ts` is only used by `BootSequence.tsx`).
