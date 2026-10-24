import "server-only";

import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/session";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

export type AccountProfile = {
  username: string;
  email: string;
  phone: string;
  businessName: string;
};

function isAccountProfile(value: unknown): value is AccountProfile {
  if (typeof value !== "object" || value === null) return false;
  return (
    "username" in value &&
    typeof value.username === "string" &&
    "email" in value &&
    (typeof value.email === "string" || value.email == null) &&
    "phone" in value &&
    typeof value.phone === "string" &&
    "businessName" in value &&
    (typeof value.businessName === "string" || value.businessName == null)
  );
}

async function requestProfile(
  method: "GET" | "PATCH",
  profile?: AccountProfile,
): Promise<AccountProfile> {
  const sessionCookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!sessionCookie) {
    throw new Error("Your session has expired. Please log in again.");
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method,
    cache: "no-store",
    headers: {
      Cookie: `${SESSION_COOKIE}=${sessionCookie}`,
      ...(profile ? { "Content-Type": "application/json" } : {}),
    },
    ...(profile ? { body: JSON.stringify(profile) } : {}),
  });

  let result: unknown;
  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    const message =
      typeof result === "object" &&
      result !== null &&
      "message" in result &&
      typeof result.message === "string"
        ? result.message
        : "Unable to load or save your account profile.";
    throw new Error(message);
  }

  if (
    typeof result !== "object" ||
    result === null ||
    !("user" in result) ||
    !isAccountProfile(result.user)
  ) {
    throw new Error("The server returned invalid account information.");
  }

  return {
    username: result.user.username,
    email: result.user.email ?? "",
    phone: result.user.phone,
    businessName: result.user.businessName ?? "",
  };
}

export function getAccountProfile(): Promise<AccountProfile> {
  return requestProfile("GET");
}

export function updateAccountProfile(
  profile: AccountProfile,
): Promise<AccountProfile> {
  return requestProfile("PATCH", profile);
}
