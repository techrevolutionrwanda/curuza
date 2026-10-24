import { Router } from "express";
import {
  currentUser,
  login,
  logout,
  register,
  updateCurrentUser,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", currentUser);
router.patch("/me", updateCurrentUser);
router.post("/logout", logout);

export default router;