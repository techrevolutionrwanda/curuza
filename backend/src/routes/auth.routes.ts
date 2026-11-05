import { Router } from "express";
import {
  register,
  login,
  logout,
  currentUser,
  updateCurrentUser,
  updatePassword,
  updatePreferences,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import {
  authRateLimiter,
  passwordResetRateLimiter,
} from "../middleware/auth-rate-limit.js";

const router = Router();

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.post("/logout", logout);
router.get("/me", currentUser);
router.patch("/me", updateCurrentUser);
router.patch("/me/password", updatePassword);
router.patch("/me/preferences", updatePreferences);
router.post("/forgot-password", passwordResetRateLimiter, forgotPassword);
router.post("/reset-password", passwordResetRateLimiter, resetPassword);

export default router;