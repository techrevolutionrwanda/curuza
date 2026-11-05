import type { CreateSaleInput, Sale } from "@/data/sales";
import { apiBaseUrl } from "@/lib/api-base";

async function request(path: string, body: unknown): Promise<Sale> {
  const response = await fetch(`${apiBaseUrl()}/api/sales${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof result === "object" &&
      result !== null &&
      "message" in result &&
      typeof result.message === "string"
        ? result.message
        : "Unable to save this sale. Please try again.";
    throw new Error(message);
  }

  if (
    typeof result !== "object" ||
    result === null ||
    !("sale" in result) ||
    typeof result.sale !== "object" ||
    result.sale === null ||
    !("id" in result.sale) ||
    typeof result.sale.id !== "string"
  ) {
    throw new Error("The server returned invalid sale data.");
  }
  return result.sale as Sale;
}

export function createSale(input: CreateSaleInput): Promise<Sale> {
  return request("", input);
}

export function recordSalePayment(id: string, amount: number): Promise<Sale> {
  return request(`/${encodeURIComponent(id)}/payments`, { amount });
}