/**
 * Build a WhatsApp click-to-chat URL.
 *
 * `numberE164` must include the leading "+" (e.g. "+250788123456"). Returns
 * null if the number is missing so callers can hide the button.
 */
export function buildWhatsAppLink(numberE164: string | null | undefined, message?: string): string | null {
  if (!numberE164) return null;
  const digits = numberE164.replace(/[^\d]/g, "");
  if (digits.length < 6) return null;
  const base = `https://wa.me/${digits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function buildQuickStartWhatsAppPrefill(opts: {
  name?: string;
  reference: string;
}): string {
  const who = opts.name ? `Hi, I'm ${opts.name}.` : "Hi DigSolutions —";
  return `${who} I just sent a Quick Start request (ref ${opts.reference}). Wanted to also reach out here.`;
}
