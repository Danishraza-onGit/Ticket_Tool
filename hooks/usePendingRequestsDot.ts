import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { fetchPendingRequests } from "../api/ticketRequests";
import { subscribePendingRequestCount } from "../utils/pendingRequestsSignal";

// Use inside the mounted Admin drawer. The dot means at least one request
// is still pending, whether or not this device has viewed its card.
export function usePendingRequestsDot(): boolean {
  const [hasPending, setHasPending] = useState(false);

  useEffect(() => {
    let mounted = true;
    const refresh = async () => {
      try {
        const data = await fetchPendingRequests();
        if (mounted) setHasPending(data.length > 0);
      } catch {
        // Keep previous state on network failures, rather than claiming zero.
      }
    };
    void refresh();
    const unsubscribe = subscribePendingRequestCount((count) => {
      if (mounted) setHasPending(count > 0);
    });
    const interval = setInterval(() => void refresh(), 30000);
    const listener = AppState.addEventListener("change", (state) => {
      if (state === "active") void refresh();
    });
    return () => {
      mounted = false;
      clearInterval(interval);
      listener.remove();
      unsubscribe();
    };
  }, []);

  return hasPending;
}
