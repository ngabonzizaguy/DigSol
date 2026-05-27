"use client";

import * as React from "react";
import { CountrySelect } from "@/components/ui/country-select";
import { findCountry } from "@/lib/marketing/countries";
import { cn } from "@/lib/utils";

export interface PhoneInputProps {
  countryCode?: string | null;
  onCountryChange?: (code: string, dial: string) => void;
  value?: string;
  onChange?: (value: string) => void;
  name?: string; // submitted as `<name>` (digits-only national); we also submit dial via hidden inputs
  countryFieldName?: string;
  dialFieldName?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
}

/**
 * PhoneInput — flag + dial code selector to the left of a national-number text field.
 *
 * Submits three values when wrapped in a form:
 *   - <name>           digits-only national portion
 *   - <countryFieldName>  ISO alpha-2 (e.g. "RW")
 *   - <dialFieldName>     "+250"
 *
 * Validation lives upstream (zod + libphonenumber-js); this component only
 * captures structured input.
 */
export function PhoneInput({
  countryCode,
  onCountryChange,
  value,
  onChange,
  name = "phone",
  countryFieldName = "phone_country",
  dialFieldName = "phone_dial",
  required,
  placeholder = "Phone number",
  className,
  id,
}: PhoneInputProps) {
  const country = findCountry(countryCode ?? undefined);

  return (
    <div className={cn("flex w-full", className)}>
      <CountrySelect
        variant="compact"
        value={country?.code}
        onChange={(entry) => onCountryChange?.(entry.code, entry.dial)}
      />
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value.replace(/[^\d\s-]/g, ""))}
        placeholder={placeholder}
        name={name}
        required={required}
        className="h-11 flex-1 rounded-r-lg border border-hairline-strong bg-surface-card px-4 text-[15px] text-ink placeholder:text-muted-soft focus:outline-none focus:border-ink transition-colors"
      />
      <input type="hidden" name={countryFieldName} value={country?.code ?? ""} readOnly />
      <input type="hidden" name={dialFieldName} value={country?.dial ?? ""} readOnly />
    </div>
  );
}
