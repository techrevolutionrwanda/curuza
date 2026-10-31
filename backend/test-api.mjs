import { create } from "express";
import dotenv from "dotenv";
import connectDB from "./dist/config/db.js";
import authRoutes from "./dist/routes/auth.routes.js";

dotenv.config();

const app = create();
app.use(require("express").json());
app.use("/api/auth", authRoutes);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

const server = app.listen(4000, async () => {
  await connectDB();
  console.log("Test server on port 4000");
  
  // Test register
  const http = require("http");
  const data = JSON.stringify({ username: "testuser", email: "test@example.com", phone: "0788000000", password: "password123" });
  
  const req = http.request({ hostname: "localhost", port: 4000, path: "/api/auth/register", method: "POST", headers: { "Content-Type": "application/json" } }, (res) => {
    let body = "";
    res.on("data", chunk => body += chunk);
    res.on("end", () => {
      console.log("Register status:", res.statusCode);
      console.log("Register body:", body);
      server.close();
    });
  });
  req.write(data);
  req.end();
});