/**
 * Rwandan mobile numbers.
 *
 * The app receives numbers in several shapes ("0788…", "788…", "+250788…",
 * "250788…") and the gateway expects one canonical MSISDN. Everything that
 * touches an SMS goes through these helpers so a number is stored and sent in
 * exactly one format.
 */

const RW_MOBILE = /^2507[2389]\d{7}$/;

/**
 * Returns the canonical `2507XXXXXXXX` form of a Rwandan mobile number, or
 * null when the input is not a valid MTN/Airtel mobile number.
 */
export function normalizeRwandaPhone(input: string | null | undefined): string | null {
  if (!input) return null;

  let digits = input.trim().replace(/[\s().-]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.startsWith("00")) digits = digits.slice(2);

  if (/^0\d{9}$/.test(digits)) {
    digits = `250${digits.slice(1)}`;
  } else if (/^7[2389]\d{7}$/.test(digits)) {
    digits = `250${digits}`;
  }

  return RW_MOBILE.test(digits) ? digits : null;
}

/** `250788123456` -> `0788123456`, the way a Rwandan reads a number. */
export function localPhone(msisdn: string): string {
  return msisdn.startsWith("250") ? `0${msisdn.slice(3)}` : msisdn;
}

/** Hides most of a number before it reaches a log line. */
export function maskPhone(msisdn: string): string {
  if (msisdn.length < 7) return "***";
  return `${msisdn.slice(0, 5)}****${msisdn.slice(-2)}`;
}

/** Every stored representation a phone may have in older sales. */
export function phoneVariants(msisdn: string): string[] {
  const local = localPhone(msisdn);
  return [msisdn, local, `+${msisdn}`, `+${local}`, local.replace(/^0/, "")];
}
