import dotenv from "dotenv";
import connectDB from "../config/db.js";
import { planReminders } from "../services/sms/planner.js";
import { dispatchPending, reconcileStatuses, recoverStuckMessages } from "../services/sms/dispatcher.js";
import { smsConfigured, smsDryRun } from "../services/sms/providers/smsconnect.js";

dotenv.config();

const PLANNER_INTERVAL = 15 * 60 * 1000;
const DISPATCH_INTERVAL = 30 * 1000;
const STATUS_INTERVAL = 5 * 60 * 1000;

let planning = false;
let dispatching = false;
let reconciling = false;

async function runPlanner(): Promise<void> {
  if (planning) return;
  planning = true;
  try {
    const result = await planReminders();
    if (result.queued > 0) {
      console.info("[sms:planner] queued=%d skipped=%d", result.queued, result.skipped);
    }
  } catch (cause) {
    console.error("[sms:planner] failed:", cause);
  } finally {
    planning = false;
  }
}

async function runDispatcher(): Promise<void> {
  if (dispatching) return;
  dispatching = true;
  try {
    const result = await dispatchPending(10);
    if (result.sent + result.failed + result.rescheduled + result.cancelled > 0) {
      console.info(
        "[sms:dispatch] sent=%d failed=%d rescheduled=%d cancelled=%d",
        result.sent,
        result.failed,
        result.rescheduled,
        result.cancelled,
      );
    }
  } catch (cause) {
    console.error("[sms:dispatch] failed:", cause);
  } finally {
    dispatching = false;
  }
}

async function runStatusCheck(): Promise<void> {
  if (reconciling) return;
  reconciling = true;
  try {
    const updated = await reconcileStatuses(10);
    if (updated > 0) console.info("[sms:status] updated=%d", updated);
  } catch (cause) {
    console.error("[sms:status] failed:", cause);
  } finally {
    reconciling = false;
  }
}

let timers: NodeJS.Timeout[] | null = null;

/**
 * Start the reminder loop. Safe to call from the API process; the atomic
 * outbox claim and idempotency keys prevent double sends if a separate worker
 * is also running.
 */
export function startSmsWorker(): () => void {
  if (timers) return () => {};

  if (smsDryRun()) {
    console.warn(
      "[sms:worker] DRY-RUN mode: messages are logged, not sent. Configure SMS_CONNECT_API_KEY and SMS_CONNECT_API_SECRET to go live.",
    );
  } else {
    console.info("[sms:worker] Gateway configured, sending live SMS.");
  }

  void runPlanner();
  void runDispatcher();
  void runStatusCheck();
  void recoverStuckMessages()
    .then((count) => {
      if (count > 0) console.warn("[sms:worker] recovered %d stuck message(s)", count);
    })
    .catch((cause) => console.error("[sms:worker] recovery failed:", cause));

  timers = [
    setInterval(() => void runPlanner(), PLANNER_INTERVAL),
    setInterval(() => void runDispatcher(), DISPATCH_INTERVAL),
    setInterval(() => void runStatusCheck(), STATUS_INTERVAL),
  ];

  console.info("[sms:worker] started (planner 15m, dispatch 30s, status 5m)");

  return () => {
    for (const timer of timers ?? []) clearInterval(timer);
    timers = null;
  };
}

async function main(): Promise<void> {
  await connectDB();
  startSmsWorker();
}

// Run as a standalone process (`npm run worker`) only when this file is the
// entry point; importing it from the API server must not connect twice.
const entry = process.argv[1]?.replace(/\\/g, "/") ?? "";
if (entry.includes("/workers/sms.worker.")) {
  void main();
}

