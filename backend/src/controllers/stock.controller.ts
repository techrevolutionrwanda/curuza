import mongoose from "mongoose";
import type { Request, Response } from "express";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import Shop from "../models/shop.model.js";

const MAX_NAME_LENGTH = 120;

type ProductLike = {
  _id: { toString(): string };
  name: string;
  initials: string;
  category: { toString(): string };
  price: number;
  qty: number;
};

type CategoryLike = {
  _id: { toString(): string };
  rw: string;
  en: string;
};

function stringField(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function numberField(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function rejectInvalidId(res: Response, label: string): void {
  res.status(400).json({ message: `Invalid ${label} id.` });
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  }
  return name.trim().slice(0, 2).toUpperCase();
}

function serializeProduct(product: ProductLike) {
  return {
    id: product._id.toString(),
    name: product.name,
    initials: product.initials,
    category: product.category.toString(),
    price: product.price,
    qty: product.qty,
  };
}

function serializeCategory(category: CategoryLike) {
  return {
    id: category._id.toString(),
    label: {
      rw: category.rw,
      en: category.en,
    },
  };
}

// Guard: ensure the user has a shop, attach shop to req.shop
async function ensureShop(req: Request, res: Response): Promise<string | null> {
  const userId = req.session?.userId;
  if (!userId || !mongoose.isValidObjectId(userId)) {
    res.status(401).json({ message: "You are not logged in." });
    return null;
  }

  const user = await User.findById(userId).select("shop");
  if (!user?.shop) {
    res.status(401).json({ message: "You must have a shop to access this resource." });
    return null;
  }

  return user.shop?.toString() || "";
}

export async function listProducts(req: Request, res: Response): Promise<void> {
  const shop = await ensureShop(req, res);
  if (!shop) return;

  const products = await Product.find({ shop }).sort({ createdAt: -1 });
  res.json({ products: products.map(serializeProduct) });
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  const shop = await ensureShop(req, res);
  if (!shop) return;

  const name = stringField(req.body?.name);
  const categoryId = stringField(req.body?.category);
  const price = numberField(req.body?.price);
  const qty = numberField(req.body?.qty);

  if (!name) {
    res.status(400).json({ message: "Product name is required." });
    return;
  }
  if (name.length > MAX_NAME_LENGTH) {
    res.status(400).json({ message: "Product name is too long." });
    return;
  }
  if (price === null || price < 0 || !Number.isSafeInteger(Math.trunc(price))) {
    res.status(400).json({ message: "Price must be a valid non-negative number." });
    return;
  }
  if (qty === null || qty < 0 || !Number.isSafeInteger(qty)) {
    res.status(400).json({ message: "Quantity must be a non-negative whole number." });
    return;
  }
  if (!mongoose.isValidObjectId(categoryId)) {
    res.status(400).json({ message: "Choose a valid category." });
    return;
  }

  const category = await Category.findOne({ _id: categoryId, shop });
  if (!category) {
    res.status(400).json({ message: "Choose a category that belongs to your shop." });
    return;
  }

  const product = await Product.create({
    shop,
    name,
    initials: initialsFor(name),
    category: category._id,
    price: Math.trunc(price),
    qty,
  });

  res.status(201).json({ product: serializeProduct(product) });
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  const shop = await ensureShop(req, res);
  if (!shop) return;

  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    rejectInvalidId(res, "product");
    return;
  }

  const name = stringField(req.body?.name);
  const categoryId = stringField(req.body?.category);
  const price = numberField(req.body?.price);
  const qty = numberField(req.body?.qty);

  if (!name) {
    res.status(400).json({ message: "Product name is required." });
    return;
  }
  if (name.length > MAX_NAME_LENGTH) {
    res.status(400).json({ message: "Product name is too long." });
    return;
  }
  if (price === null || price < 0 || !Number.isSafeInteger(Math.trunc(price))) {
    res.status(400).json({ message: "Price must be a valid non-negative number." });
    return;
  }
  if (qty === null || qty < 0 || !Number.isSafeInteger(qty)) {
    res.status(400).json({ message: "Quantity must be a non-negative whole number." });
    return;
  }
  if (!mongoose.isValidObjectId(categoryId)) {
    res.status(400).json({ message: "Choose a valid category." });
    return;
  }

  const category = await Category.findOne({ _id: categoryId, shop });
  if (!category) {
    res.status(400).json({ message: "Choose a category that belongs to your shop." });
    return;
  }

  const product = await Product.findOneAndUpdate(
    { _id: id, shop },
    {
      name,
      initials: initialsFor(name),
      category: category._id,
      price: Math.trunc(price),
      qty,
    },
    { new: true, runValidators: true }
  );

  if (!product) {
    res.status(404).json({ message: "Product not found." });
    return;
  }

  res.json({ product: serializeProduct(product) });
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  const shop = await ensureShop(req, res);
  if (!shop) return;

  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    rejectInvalidId(res, "product");
    return;
  }

  const product = await Product.findOneAndDelete({ _id: id, shop });

  if (!product) {
    res.status(404).json({ message: "Product not found." });
    return;
  }

  res.json({ product: serializeProduct(product) });
}

export async function restockProduct(req: Request, res: Response): Promise<void> {
  const shop = await ensureShop(req, res);
  if (!shop) return;

  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    rejectInvalidId(res, "product");
    return;
  }

  const amount = numberField(req.body?.amount);
  if (amount === null || amount <= 0 || !Number.isSafeInteger(amount)) {
    res.status(400).json({ message: "Restock amount must be a positive whole number." });
    return;
  }

  const product = await Product.findOneAndUpdate(
    { _id: id, shop },
    { $inc: { qty: amount } },
    { new: true, runValidators: true }
  );

  if (!product) {
    res.status(404).json({ message: "Product not found." });
    return;
  }

  res.json({ product: serializeProduct(product) });
}

export async function listCategories(req: Request, res: Response): Promise<void> {
  const shop = await ensureShop(req, res);
  if (!shop) return;

  const categories = await Category.find({ shop }).sort({ createdAt: 1 });
  res.json({ categories: categories.map(serializeCategory) });
}

export async function createCategory(req: Request, res: Response): Promise<void> {
  const shop = await ensureShop(req, res);
  if (!shop) return;

  const rw = stringField(req.body?.nameRw);
  const en = stringField(req.body?.nameEn);

  if (!rw) {
    res.status(400).json({ message: "The Kinyarwanda category name is required." });
    return;
  }
  if (!en) {
    res.status(400).json({ message: "The English category name is required." });
    return;
  }
  if (rw.length > MAX_NAME_LENGTH || en.length > MAX_NAME_LENGTH) {
    res.status(400).json({ message: "One or more category names are too long." });
    return;
  }

  try {
    const category = await Category.create({ shop, rw, en });
    res.status(201).json({ category: serializeCategory(category) });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      res.status(409).json({ message: "A category with that name already exists." });
      return;
    }
    throw error;
  }
}