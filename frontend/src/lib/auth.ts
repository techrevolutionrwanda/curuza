const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

export type AuthUser = {
  id: string;
  username: string;
  email?: string;
  phone: string;
  businessName?: string;
};

async function requestAuth(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  return fetch(`${API_BASE_URL}/api/auth/${path}`, {
    ...init,
    credentials: "include",
  });
}

async function errorMessage(response: Response): Promise<string> {
  const result: unknown = await response.json().catch(() => null);
  return typeof result === "object" &&
    result !== null &&
    "message" in result &&
    typeof result.message === "string"
    ? result.message
    : "Unable to complete your request. Please try again.";
}

export async function submitAuth(
  action: "login" | "register",
  values: Record<string, string>,
): Promise<void> {
  const response = await requestAuth(action, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error(await errorMessage(response));
  }
}

export async function fetchCurrentUser(
  signal?: AbortSignal,
): Promise<AuthUser | null> {
  const response = await requestAuth("me", { signal });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error(await errorMessage(response));

  const result: unknown = await response.json();
  if (
    typeof result !== "object" ||
    result === null ||
    !("user" in result) ||
    typeof result.user !== "object" ||
    result.user === null ||
    !("id" in result.user) ||
    !("username" in result.user) ||
    !("phone" in result.user) ||
    typeof result.user.id !== "string" ||
    typeof result.user.username !== "string" ||
    typeof result.user.phone !== "string"
  ) {
    throw new Error("The server returned invalid account information.");
  }

  return {
    id: result.user.id,
    username: result.user.username,
    phone: result.user.phone,
    email:
      "email" in result.user && typeof result.user.email === "string"
        ? result.user.email
        : undefined,
    businessName:
      "businessName" in result.user &&
      typeof result.user.businessName === "string"
        ? result.user.businessName
        : undefined,
  };
}

export async function logoutAuth(): Promise<void> {
  const response = await requestAuth("logout", { method: "POST" });
  if (!response.ok) throw new Error(await errorMessage(response));
}
