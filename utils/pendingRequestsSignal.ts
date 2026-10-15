// Lightweight in-memory notification for screens in the same running app.
// The backend remains the source of truth after each successful fetch.
type Listener = (count: number) => void;
const listeners = new Set<Listener>();
export function publishPendingRequestCount(count: number) {
  listeners.forEach((listener) => listener(count));
}
export function subscribePendingRequestCount(listener: Listener): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
