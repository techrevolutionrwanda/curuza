"use client";

import { useActionState } from "react";
import type { ToggleAction, ToggleState } from "@/data/settings";

/**
 * An on/off switch for a setting.
 *
 * The switch is a real form, so it works without JavaScript and posts to
 * the server action that stores the new value.
 */
export function SettingToggle({
  action,
  enabled,
  label,
  disabled = false,
}: {
  action: ToggleAction;
  enabled: boolean;
  label: string;
  disabled?: boolean;
}) {
  const [state, formAction, pending] = useActionState<ToggleState, FormData>(
    action,
    { enabled },
  );

  const on = state.enabled;

  return (
    <form action={formAction}>
      <input type="hidden" name="enabled" value={on ? "false" : "true"} />
      <button
        type="submit"
        role="switch"
        aria-checked={on}
        aria-label={label}
        disabled={pending || disabled}
        className={`relative block h-[28px] w-[48px] shrink-0 rounded-pill p-0 transition disabled:opacity-60 ${
          on ? "bg-primary" : "bg-line"
        }`}
      >
        <span
          className={`absolute left-[3px] top-[3px] h-[22px] w-[22px] rounded-full bg-surface shadow-card transition-transform ${
            on ? "translate-x-[20px]" : "translate-x-0"
          }`}
        />
      </button>
    </form>
  );
}
