import { apiClient } from "./client";

export type UserRole = "admin" | "employee";
export type UserTeam = "FMS" | "Field";

export type AppUser = {
  id: number;
  username: string;
  role: UserRole;
  displayName: string;
  email: string | null;
  createdAt: string;
  isActive: boolean;
  team: UserTeam | null;
};

export type CreateUserInput = {
  username: string;
  password: string;
  role: UserRole;
  displayName: string;
  email?: string;
  team?: UserTeam;
};

export async function fetchUsers(): Promise<AppUser[]> {
  const { data } = await apiClient.get<AppUser[]>("/users");
  return data;
}

export async function createUser(input: CreateUserInput): Promise<AppUser> {
  const { data } = await apiClient.post<AppUser>("/users", input);
  return data;
}

export async function setUserActive(id: number, isActive: boolean): Promise<AppUser> {
  const { data } = await apiClient.patch<AppUser>(`/users/${id}/active`, { isActive });
  return data;
}
