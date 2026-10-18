import { File, Paths } from "expo-file-system";
import { Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import { fetch as expoFetch } from "expo/fetch";

export type ExportFilters = {
  dateFrom?: string;
  dateTo?: string;
  assigneeUserId?: number;
  overdue?: string;
  status?: string;
  callType?: string;
  assignedBy?: string;
  accountManager?: string;
  priority?: string;
  search?: string;
};
export type ImportResult = {
  created: number;
  failedCount: number;
  errors: { row: number; success?: boolean; error?: string }[];
};
export type ExcelSelection = DocumentPicker.DocumentPickerAsset;

const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

function apiUrl(path: string, params?: Record<string, string>): string {
  const base = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("EXPO_PUBLIC_API_BASE_URL is not configured.");
  const url = `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  const entries = Object.entries(params ?? {}).filter(([, value]) => value !== "");
  return entries.length ? `${url}?${new URLSearchParams(entries).toString()}` : url;
}

async function failureMessage(response: Response): Promise<string> {
  if (response.status === 401 || response.status === 403) {
    return "Session expired or access denied. Sign in with an admin account and retry.";
  }
  try {
    const body: unknown = await response.json();
    if (body && typeof body === "object" && "error" in body) {
      const error = body.error;
      if (typeof error === "string") return error;
      return JSON.stringify(error);
    }
  } catch { /* Response might be HTML or empty. */ }
  return `Server returned HTTP ${response.status}.`;
}

async function downloadAndShare(endpoint: string, filename: string) {
  const response = await expoFetch(apiUrl(endpoint), {
    method: "GET",
    credentials: "include",
    headers: { Accept: XLSX_MIME },
  });
  if (!response.ok) throw new Error(await failureMessage(response));

  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length < 4 || bytes[0] !== 0x50 || bytes[1] !== 0x4b) {
    throw new Error("The server did not return a valid Excel workbook.");
  }
  const file = new File(Paths.cache, filename);
  file.create({ overwrite: true });
  await file.write(bytes);
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error("The Excel file was downloaded, but the device cannot open the share sheet.");
  }
  // Start the share sheet without holding the Dashboard busy state open.
  void Sharing.shareAsync(file.uri, {
    mimeType: XLSX_MIME,
    dialogTitle: "Save Excel workbook",
    UTI: "org.openxmlformats.spreadsheetml.sheet",
  }).catch((error: unknown) => {
    console.log("Excel share sheet error:", error);
    Alert.alert(
      "Unable to Open File",
      error instanceof Error ? error.message : "Unable to open the Excel share sheet."
    );
  });
}

export async function exportTicketWorkbook(filters: ExportFilters = {}): Promise<void> {
  const params: Record<string, string> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      params[key] = String(value);
    }
  }
  const query = new URLSearchParams(params).toString();
  const suffix = query ? `?${query}` : "";
  const datePart = new Date().toISOString().replace(/[:.]/g, "-");
  await downloadAndShare(`tickets/export${suffix}`, `cygnus-tickets-${datePart}.xlsx`);
}

export async function downloadTicketTemplate(): Promise<void> {
  await downloadAndShare("tickets/import-template", "cygnus-ticket-import-template.xlsx");
}

export async function pickTicketWorkbook(): Promise<ExcelSelection | null> {
  const picked = await DocumentPicker.getDocumentAsync({
    type: [XLSX_MIME, "application/vnd.ms-excel", "application/octet-stream"],
    copyToCacheDirectory: true,
    multiple: false,
  });
  if (picked.canceled) return null;
  const asset = picked.assets[0];
  if (!asset.name.toLowerCase().endsWith(".xlsx")) {
    throw new Error("Please select an .xlsx Excel workbook.");
  }
  if (asset.size !== undefined && asset.size > 10 * 1024 * 1024) {
    throw new Error("The workbook exceeds the server's 10 MB upload limit.");
  }
  return asset;
}

export async function importTicketWorkbook(selection: ExcelSelection): Promise<ImportResult> {
  const file = new File(selection.uri);
  const form = new FormData();
  // Field name must match backend upload.single("file").
  form.append("file", file);
  const response = await expoFetch(apiUrl("tickets/import"), {
    method: "POST",
    credentials: "include",
    body: form,
  });
  // Backend may return HTTP 400 with a useful per-row report when all rows fail.
  const data: unknown = await response.json();
  if (data && typeof data === "object" && "created" in data && "failedCount" in data) {
    const result = data as ImportResult;
    return { created: result.created, failedCount: result.failedCount, errors: Array.isArray(result.errors) ? result.errors : [] };
  }
  if (!response.ok) {
    const message = data && typeof data === "object" && "error" in data && typeof data.error === "string"
      ? data.error
      : `Server returned HTTP ${response.status}.`;
    throw new Error(message);
  }
  throw new Error("The server returned an unexpected import response.");
}
