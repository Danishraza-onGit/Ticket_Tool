import { apiClient } from "./client";

export type UserRole =
  | "admin"
  | "employee";

export type UserTeam =
  | "FMS"
  | "Field";

export type AuthUser = {
  id: number;
  username: string;
  role: "admin" | "employee";
  displayName: string;
  email: string | null;
  team: "FMS" | "Field" | null;
};

export async function login(
  username: string,
  password: string
) {
  const response =
    await apiClient.post<AuthUser>(
      "/auth/login",
      {
        username,
        password,
      }
    );

  return response.data;
}

export async function logout() {
  await apiClient.post(
    "/auth/logout"
  );
}

export async function getCurrentUser() {
  const response =
    await apiClient.get<AuthUser>(
      "/auth/me"
    );

  return response.data;
}