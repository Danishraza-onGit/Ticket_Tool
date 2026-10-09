import { apiClient } from "./client";

export type AccountManager = {
    id: number;
    name: string;
    email: string;
    userId: number | null;
    createdAt: string;
};

export type CreateAccountManagerInput = {
    name: string;
    email: string;
};

export async function createAccountManager(
    input: CreateAccountManagerInput
): Promise<AccountManager> {
    const { data } =
        await apiClient.post<AccountManager>(
            "/account-managers",
            input
        );

    return data;
}