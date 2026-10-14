
import { apiClient } from "./client";

export type SmtpSettingsResponse = {
  host: string;
  port: number;
  username: string;
  fromAddress: string;
  fromName: string;
  secure: boolean;
  hasPassword: boolean;
};

export type UpdateSmtpSettingsInput = {
  host: string;
  port: number;
  username: string;
  password?: string;
  fromAddress: string;
  fromName: string;
  secure: boolean;
};

export async function fetchSmtpSettings(): Promise<SmtpSettingsResponse> {
  const response = await apiClient.get<SmtpSettingsResponse>(
    "/settings/smtp"
  );

  return response.data;
}

export async function updateSmtpSettings(
  input: UpdateSmtpSettingsInput
): Promise<void> {
  await apiClient.put("/settings/smtp", input);
}
