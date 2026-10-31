import { Router } from "express";
import {
  listMessages,
  previewReminder,
  sendAllReminders,
  sendReminder,
} from "../controllers/sms.controller.js";

const router = Router();

router.get("/messages", listMessages);
router.post("/reminders/preview", previewReminder);
router.post("/reminders", sendReminder);
router.post("/reminders/all", sendAllReminders);

export default router;
