"use server";

import { refresh } from "next/cache";
import * as repo from "./repository";

export type FormErrors = Record<string, string>;

export type ActionResult =
  | { ok: true; name: string }
  | { ok: false; errors: FormErrors };

const OK = (name: string): ActionResult => ({ ok: true, name });
const ERR = (errors: FormErrors): ActionResult => ({ ok: false, errors });

function num(v: FormDataEntryValue | null): number | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function str(v: FormDataEntryValue | null): string {
  if (typeof v !== "string") return "";
  return v.trim();
}

function productErrors(input: {
  name: string;
  category: string;
  price: number | null;
  qty: number | null;
}): FormErrors {
  const errors: FormErrors = {};
  if (!input.name) errors.name = "required";
  if (!input.category) errors.category = "required";
  if (input.price === null || input.price < 0) errors.price = "number";
  if (input.qty === null || input.qty < 0 || !Number.isInteger(input.qty)) errors.qty = "number";
  return errors;
}

function isDuplicateError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    error.status === 409
  );
}

export async function createProductAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const name = str(formData.get("name"));
  const category = str(formData.get("category"));
  const price = num(formData.get("price"));
  const qty = num(formData.get("qty"));
  const errors = productErrors({ name, category, price, qty });
  if (Object.keys(errors).length > 0) return ERR(errors);
  try {
    const created = await repo.createProduct({
      name,
      category,
      price: price ?? 0,
      qty: qty ?? 0,
    });
    refresh();
    return OK(created.name);
  } catch {
    return ERR({ name: "invalid" });
  }
}

export async function updateProductAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const id = str(formData.get("id"));
  const name = str(formData.get("name"));
  const category = str(formData.get("category"));
  const price = num(formData.get("price"));
  const qty = num(formData.get("qty"));
  if (!id) return ERR({ id: "invalid" });
  const errors = productErrors({ name, category, price, qty });
  if (Object.keys(errors).length > 0) return ERR(errors);
  try {
    const updated = await repo.updateProduct(id, {
      name,
      category,
      price: price ?? 0,
      qty: qty ?? 0,
    });
    refresh();
    return OK(updated.name);
  } catch {
    return ERR({ id: "invalid" });
  }
}

export async function deleteProductAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const id = str(formData.get("id"));
  if (!id) return ERR({ id: "invalid" });
  try {
    const product = await repo.deleteProduct(id);
    refresh();
    return OK(product.name);
  } catch {
    return ERR({ id: "invalid" });
  }
}

export async function restockProductAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const id = str(formData.get("id"));
  const amount = num(formData.get("amount"));
  if (!id) return ERR({ id: "invalid" });
  if (amount === null || amount <= 0 || !Number.isInteger(amount)) {
    return ERR({ amount: "number" });
  }
  try {
    const updated = await repo.restockProduct(id, amount);
    refresh();
    return OK(updated.name);
  } catch {
    return ERR({ id: "invalid" });
  }
}

export async function createCategoryAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const nameRw = str(formData.get("nameRw"));
  const nameEn = str(formData.get("nameEn"));
  const locale = str(formData.get("locale")) === "en" ? "en" : "rw";
  const errors: FormErrors = {};
  if (!nameRw) errors.nameRw = "required";
  if (!nameEn) errors.nameEn = "required";
  if (Object.keys(errors).length > 0) return ERR(errors);
  try {
    await repo.createCategory({ nameRw, nameEn });
  } catch (error) {
    if (isDuplicateError(error)) return ERR({ nameRw: "duplicate" });
    return ERR({ nameRw: "invalid" });
  }
  refresh();
  return OK(locale === "en" ? nameEn : nameRw);
}
