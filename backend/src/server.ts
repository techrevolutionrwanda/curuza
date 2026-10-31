import express, { type Request, type Response } from "express";
import cors from "cors";
import session from "express-session";
import connectMongo from "connect-mongo";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import stockRoutes from "./routes/stock.routes.js";
import salesRoutes from "./routes/sales.routes.js";
import settingsRoutes from "./routes/settings.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const sessionSecret = process.env.SESSION_SECRET;
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim());

if (!sessionSecret) {
  throw new Error("SESSION_SECRET is missing from the backend environment");
}

app.use(cors({ origin: allowedOrigins, credentials: true }));

// session store backed by MongoDB (TTL index expires tokens automatically)
import MongoStore from "connect-mongo";
app.use(
  session({
    name: "curuza_session",
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URI,
      ttl: 7 * 24 * 60 * 60, // 7 days
    }),
  })
);

app.use(express.json({ limit: "10kb" }));

app.use("/api/auth", authRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/settings", settingsRoutes);

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

void startServer();