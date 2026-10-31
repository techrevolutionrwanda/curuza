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

type AccountResponse = {
  user: {
    username: string;
    email?: string | null;
    phone: string;
  };
  shop: {
    name: string;
  };
};

function isAccountResponse(value: unknown): value is AccountResponse {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  if (!("user" in value) || typeof value.user !== "object" || value.user === null) {
    return false;
  }
  if (!("shop" in value) || typeof value.shop !== "object" || value.shop === null) {
    return false;
  }

  const { user, shop } = value;
  return (
    "username" in user &&
    typeof user.username === "string" &&
    (!("email" in user) || typeof user.email === "string" || user.email == null) &&
    "phone" in user &&
    typeof user.phone === "string" &&
    "name" in shop &&
    typeof shop.name === "string"
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
    !isAccountResponse(result)
  ) {
    throw new Error("The server returned invalid account information.");
  }

  return {
    username: result.user.username,
    email: result.user.email ?? "",
    phone: result.user.phone,
    businessName: result.shop.name,
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
