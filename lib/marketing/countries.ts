/**
 * Minimal country list (ISO alpha-2 + dial code + flag emoji) used by the
 * Quick Start flow and contact form upgrades. Kept small and dependency-free;
 * the full list lives in `libphonenumber-js` if we ever need it.
 *
 * Flag emoji is derived from the ISO code (regional indicator letters).
 */

export type CountryEntry = {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  dial: string; // E.164 country calling code, e.g. "+250"
};

export const COUNTRIES: CountryEntry[] = [
  { code: "RW", name: "Rwanda", dial: "+250" },
  { code: "KE", name: "Kenya", dial: "+254" },
  { code: "UG", name: "Uganda", dial: "+256" },
  { code: "TZ", name: "Tanzania", dial: "+255" },
  { code: "BI", name: "Burundi", dial: "+257" },
  { code: "ET", name: "Ethiopia", dial: "+251" },
  { code: "ZA", name: "South Africa", dial: "+27" },
  { code: "NG", name: "Nigeria", dial: "+234" },
  { code: "GH", name: "Ghana", dial: "+233" },
  { code: "EG", name: "Egypt", dial: "+20" },
  { code: "US", name: "United States", dial: "+1" },
  { code: "CA", name: "Canada", dial: "+1" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "IE", name: "Ireland", dial: "+353" },
  { code: "FR", name: "France", dial: "+33" },
  { code: "DE", name: "Germany", dial: "+49" },
  { code: "ES", name: "Spain", dial: "+34" },
  { code: "IT", name: "Italy", dial: "+39" },
  { code: "PT", name: "Portugal", dial: "+351" },
  { code: "NL", name: "Netherlands", dial: "+31" },
  { code: "BE", name: "Belgium", dial: "+32" },
  { code: "CH", name: "Switzerland", dial: "+41" },
  { code: "SE", name: "Sweden", dial: "+46" },
  { code: "NO", name: "Norway", dial: "+47" },
  { code: "DK", name: "Denmark", dial: "+45" },
  { code: "FI", name: "Finland", dial: "+358" },
  { code: "AE", name: "United Arab Emirates", dial: "+971" },
  { code: "SA", name: "Saudi Arabia", dial: "+966" },
  { code: "QA", name: "Qatar", dial: "+974" },
  { code: "TR", name: "Turkey", dial: "+90" },
  { code: "IN", name: "India", dial: "+91" },
  { code: "PK", name: "Pakistan", dial: "+92" },
  { code: "BD", name: "Bangladesh", dial: "+880" },
  { code: "ID", name: "Indonesia", dial: "+62" },
  { code: "SG", name: "Singapore", dial: "+65" },
  { code: "MY", name: "Malaysia", dial: "+60" },
  { code: "PH", name: "Philippines", dial: "+63" },
  { code: "TH", name: "Thailand", dial: "+66" },
  { code: "VN", name: "Vietnam", dial: "+84" },
  { code: "JP", name: "Japan", dial: "+81" },
  { code: "KR", name: "South Korea", dial: "+82" },
  { code: "CN", name: "China", dial: "+86" },
  { code: "HK", name: "Hong Kong", dial: "+852" },
  { code: "TW", name: "Taiwan", dial: "+886" },
  { code: "AU", name: "Australia", dial: "+61" },
  { code: "NZ", name: "New Zealand", dial: "+64" },
  { code: "BR", name: "Brazil", dial: "+55" },
  { code: "AR", name: "Argentina", dial: "+54" },
  { code: "MX", name: "Mexico", dial: "+52" },
  { code: "CL", name: "Chile", dial: "+56" },
  { code: "CO", name: "Colombia", dial: "+57" },
];

export function flagEmoji(code: string): string {
  if (!code || code.length !== 2) return "🌐";
  const base = 127397; // 'A'.codePointAt(0)! is 65; regional indicator base is 0x1F1E6 = 127462. 127462 - 65 = 127397.
  return String.fromCodePoint(...code.toUpperCase().split("").map((c) => c.charCodeAt(0) + base));
}

export function findCountry(code: string | null | undefined): CountryEntry | undefined {
  if (!code) return undefined;
  return COUNTRIES.find((c) => c.code === code.toUpperCase());
}

export function findByDial(dial: string): CountryEntry | undefined {
  return COUNTRIES.find((c) => c.dial === dial);
}
