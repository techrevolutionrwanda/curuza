import mongoose from "mongoose";
import type { Request, Response } from "express";
import Product from "../models/product.model.js";
import Sale, { type SalePaymentMethod, type SaleRecord } from "../models/sale.model.js";
import User from "../models/user.model.js";

type SaleItemInput = {
  productId: string;
  quantity: number;
};

function stringField(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function integerField(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

async function shopForRequest(req: Request, res: Response): Promise<string | null> {
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

  return user.shop.toString();
}

function serializeSale(sale: SaleRecord & { _id: { toString(): string } }) {
  return {
    id: sale._id.toString(),
    items: sale.items.map((item) => ({
      productId: item.product.toString(),
      name: item.name,
      category: item.category.toString(),
      price: item.price,
      quantity: item.quantity,
    })),
    customerName: sale.customerName,
    customerPhone: sale.customerPhone,
    paymentMethod: sale.paymentMethod,
    total: sale.total,
    paid: sale.paid,
    owed: sale.owed,
    createdAt: sale.createdAt.toISOString(),
  };
}

export async function listSales(req: Request, res: Response): Promise<void> {
  const shop = await shopForRequest(req, res);
  if (!shop) return;

  const sales = await Sale.find({ shop }).sort({ createdAt: -1 }).lean();
  res.json({
    sales: sales.map((sale) =>
      serializeSale(sale as SaleRecord & { _id: { toString(): string } }),
    ),
  });
}

export async function createSale(req: Request, res: Response): Promise<void> {
  const shop = await shopForRequest(req, res);
  if (!shop) return;

  const paymentMethod = stringField(req.body?.paymentMethod) as SalePaymentMethod;
  if (!["cash", "partial", "credit"].includes(paymentMethod)) {
    res.status(400).json({ message: "Choose a valid payment method." });
    return;
  }

  if (!Array.isArray(req.body?.items) || req.body.items.length === 0) {
    res.status(400).json({ message: "Add at least one product to the sale." });
    return;
  }

  const quantities = new Map<string, number>();
  for (const item of req.body.items as SaleItemInput[]) {
    if (!mongoose.isValidObjectId(item?.productId)) {
      res.status(400).json({ message: "Choose a valid product." });
      return;
    }
    const quantity = integerField(item.quantity);
    if (quantity === null || quantity <= 0) {
      res.status(400).json({ message: "Product quantities must be positive whole numbers." });
      return;
    }
    const nextQuantity = (quantities.get(item.productId) ?? 0) + quantity;
    if (!Number.isSafeInteger(nextQuantity)) {
      res.status(400).json({ message: "The requested quantity is too large." });
      return;
    }
    quantities.set(item.productId, nextQuantity);
  }

  const productIds = [...quantities.keys()];
  const products = await Product.find({ _id: { $in: productIds }, shop }).lean();
  if (products.length !== productIds.length) {
    res.status(400).json({ message: "One or more products are not available in this shop." });
    return;
  }

  const items = products.map((product) => ({
    product: product._id,
    name: product.name,
    category: product.category,
    price: product.price,
    quantity: quantities.get(product._id.toString())!,
  }));
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (!Number.isSafeInteger(total) || total <= 0) {
    res.status(400).json({ message: "The sale total is invalid." });
    return;
  }

  const paidInput = integerField(req.body?.paid);
  const paid = paymentMethod === "cash" ? total : paymentMethod === "credit" ? 0 : paidInput;
  if (
    paid === null ||
    paid < 0 ||
    paid > total ||
    (paymentMethod === "partial" && (paid === 0 || paid === total))
  ) {
    res.status(400).json({ message: "Enter a valid amount received for this sale." });
    return;
  }

  const owed = total - paid;
  const customerName = stringField(req.body?.customerName);
  const customerPhone = stringField(req.body?.customerPhone).replace(/[\s()-]/g, "");
  if (owed > 0 && (!customerName || !customerPhone)) {
    res.status(400).json({ message: "Enter the customer's name and phone for an unpaid balance." });
    return;
  }
  if (customerName.length > 120 || customerPhone.length > 30 || (customerPhone && !/^\+?[0-9]{7,20}$/.test(customerPhone))) {
    res.status(400).json({ message: "Enter a valid customer name and phone number." });
    return;
  }

  const changedProducts: Array<{ id: string; quantity: number }> = [];
  for (const item of items) {
    const update = await Product.updateOne(
      { _id: item.product, shop, qty: { $gte: item.quantity } },
      { $inc: { qty: -item.quantity } },
    );
    if (update.modifiedCount !== 1) {
      await Promise.all(
        changedProducts.map(({ id, quantity }) =>
          Product.updateOne({ _id: id, shop }, { $inc: { qty: quantity } }),
        ),
      );
      res.status(409).json({ message: `Not enough stock for ${item.name}.` });
      return;
    }
    changedProducts.push({ id: item.product.toString(), quantity: item.quantity });
  }

  try {
    const sale = await Sale.create({
      shop,
      items,
      customerName,
      customerPhone,
      paymentMethod,
      total,
      paid,
      owed,
    });
    res.status(201).json({
      sale: serializeSale(sale as SaleRecord & { _id: { toString(): string } }),
    });
  } catch {
    await Promise.all(
      changedProducts.map(({ id, quantity }) =>
        Product.updateOne({ _id: id, shop }, { $inc: { qty: quantity } }),
      ),
    );
    res.status(500).json({ message: "Unable to save the sale. Stock has been restored." });
  }
}

export async function recordPayment(req: Request, res: Response): Promise<void> {
  const shop = await shopForRequest(req, res);
  if (!shop) return;

  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid sale id." });
    return;
  }

  const amount = integerField(req.body?.amount);
  if (amount === null || amount <= 0) {
    res.status(400).json({ message: "Payment must be a positive whole number." });
    return;
  }

  const sale = await Sale.findOneAndUpdate(
    { _id: id, shop, owed: { $gte: amount } },
    { $inc: { paid: amount, owed: -amount } },
    { new: true, runValidators: true },
  );
  if (!sale) {
    const exists = await Sale.exists({ _id: id, shop });
    res.status(exists ? 400 : 404).json({
      message: exists ? "Payment exceeds the outstanding balance." : "Sale not found.",
    });
    return;
  }

  res.json({ sale: serializeSale(sale as SaleRecord & { _id: { toString(): string } }) });
}