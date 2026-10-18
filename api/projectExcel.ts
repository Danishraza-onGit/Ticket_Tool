import { Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { fetch as expoFetch } from "expo/fetch";

export type ProjectExportFilters = {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  assigneeUserId?: number;
  assignedBy?: string;
  accountManager?: string;
  priority?: string;
  search?: string;
  overdue?: string;
};

export type ProjectImportResult = {
  created: number;
  failedCount: number;
  errors: { row: number; success?: boolean; projectNo?: string; error?: string }[];
};

export type ProjectExcelSelection = DocumentPicker.DocumentPickerAsset;

const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

function apiUrl(path: string, params: Record<string, string> = {}): string {
  const base = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("EXPO_PUBLIC_API_BASE_URL is not configured.");
  const url = `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  const query = new URLSearchParams(params).toString();
  return query ? `${url}?${query}` : url;
}

async function failureMessage(response: Response): Promise<string> {
  if (response.status === 401) return "Your session expired. Sign in and retry.";
  if (response.status === 403) return "You don't have permission for this project Excel operation.";
  try {
    const data: unknown = await response.json();
    if (data && typeof data === "object" && "error" in data) {
      const error = data.error;
      return typeof error === "string" ? error : JSON.stringify(error);
    }
  } catch { /* The response may be HTML or empty. */ }
  return `Server returned HTTP ${response.status}.`;
}

async function downloadAndShare(path: string, filename: string): Promise<void> {
  const response = await expoFetch(apiUrl(path), {
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
    throw new Error("The file downloaded, but sharing isn't available on this device.");
  }
  // Match the working ticket implementation: avoid holding the busy state
  // until iOS has dismissed the native share sheet.
  void Sharing.shareAsync(file.uri, {
    mimeType: XLSX_MIME,
    dialogTitle: "Save Projects Excel workbook",
    UTI: "org.openxmlformats.spreadsheetml.sheet",
  }).catch((error: unknown) => {
    console.log("Projects share sheet error:", error);
    Alert.alert("Unable to Open File", error instanceof Error ? error.message : "Unable to open the share sheet.");
  });
}

export async function exportProjectWorkbook(filters: ProjectExportFilters = {}): Promise<void> {
  const params: Record<string, string> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") params[key] = String(value);
  }
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const query = new URLSearchParams(params).toString();
  await downloadAndShare(`projects/export${query ? `?${query}` : ""}`, `cygnus-projects-${stamp}.xlsx`);
}

export async function downloadProjectTemplate(): Promise<void> {
  await downloadAndShare("projects/import-template", "cygnus-project-import-template.xlsx");
}

export async function pickProjectWorkbook(): Promise<ProjectExcelSelection | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: [XLSX_MIME, "application/vnd.ms-excel", "application/octet-stream"],
    copyToCacheDirectory: true,
    multiple: false,
  });
  if (result.canceled) return null;
  const asset = result.assets[0];
  if (!asset.name.toLowerCase().endsWith(".xlsx")) {
    throw new Error("Please select an .xlsx Excel workbook.");
  }
  if (asset.size !== undefined && asset.size > 10 * 1024 * 1024) {
    throw new Error("The workbook exceeds the 10 MB upload limit.");
  }
  return asset;
}

export async function importProjectWorkbook(selection: ProjectExcelSelection): Promise<ProjectImportResult> {
  const file = new File(selection.uri);
  const form = new FormData();
  form.append("file", file);
  const response = await expoFetch(apiUrl("projects/import"), {
    method: "POST",
    credentials: "include",
    body: form,
  });
  // Even HTTP 400 can include valid per-row results when zero rows succeeded.
  const data: unknown = await response.json();
  if (data && typeof data === "object" && "created" in data && "failedCount" in data) {
    const result = data as ProjectImportResult;
    return {
      created: result.created,
      failedCount: result.failedCount,
      errors: Array.isArray(result.errors) ? result.errors : [],
    };
  }
  if (!response.ok) {
    const msg = data && typeof data === "object" && "error" in data && typeof data.error === "string"
      ? data.error : `Server returned HTTP ${response.status}.`;
    throw new Error(msg);
  }
  throw new Error("Unexpected response from the Projects import endpoint.");
}
