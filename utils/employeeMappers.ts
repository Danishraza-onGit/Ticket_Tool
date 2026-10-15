import type { AppUser } from "../api/users";
import type { AccountManager as ApiAccountManager } from "../api/accountManagers";
import type { AccountManager, Employee } from "../types/employee";
import { getInitials } from "./getInitials";

export function mapUserToEmployee(user: AppUser): Employee {
  return {
    id: user.id,
    initials: getInitials(user.displayName),
    fullName: user.displayName,
    username: user.username,
    email: user.email?.trim() || "—",
    role: user.role === "admin" ? "Admin" : "Employee",
    team: user.team ?? "—",
    status: user.isActive ? "Active" : "Inactive",
  };
}

export function mapAccountManager(manager: ApiAccountManager): AccountManager {
  return {
    id: manager.id,
    initials: getInitials(manager.name),
    fullName: manager.name,
    email: manager.email.trim() || "—",
  };
}
