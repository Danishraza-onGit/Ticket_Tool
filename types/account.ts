export type AccountTab =
  | "profile"
  | "password"
  | "settings";

export type AccountProfile = {
  username: string;
  displayName: string;
  email: string;
};

export type PasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type SmtpSettings = {
  host: string;
  port: string;
  username: string;
  password: string;
  fromAddress: string;
  fromName: string;
  useTlsSsl: boolean;
};