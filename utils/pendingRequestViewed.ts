import AsyncStorage from "@react-native-async-storage/async-storage";

// Local, per-installation read markers. The backend has no "Viewed" status.
const KEY = "cygnus:pending-requests:viewed-ids:v1";

export async function getViewedRequestIds(): Promise<Set<number>> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return new Set();
  try {
    const value: unknown = JSON.parse(raw);
    return new Set(
      Array.isArray(value) ? value.filter((id): id is number => typeof id === "number") : []
    );
  } catch {
    return new Set();
  }
}

export async function markRequestsViewed(ids: number[]): Promise<void> {
  if (!ids.length) return;
  const viewed = await getViewedRequestIds();
  ids.forEach((id) => viewed.add(id));
  await AsyncStorage.setItem(KEY, JSON.stringify([...viewed]));
}
