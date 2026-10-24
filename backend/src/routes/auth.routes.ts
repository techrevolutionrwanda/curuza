import { Router } from "express";
import {
  currentUser,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", currentUser);
router.post("/logout", logout);

export default router;