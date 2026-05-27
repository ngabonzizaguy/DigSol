"use client";

import { Input } from "@/components/ui/input";
import { CountrySelect } from "@/components/ui/country-select";
import { PhoneInput } from "@/components/ui/phone-input";
import { useQuickStart } from "../quick-start-provider";

export function StepAbout() {
  const { draft, setDraft, config } = useQuickStart();

  return (
    <div className="min-w-0 space-y-4">
      <p className="text-[15px] text-body">{config.copy.about.body}</p>
      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
        <label className="min-w-0 space-y-1.5">
          <span className="text-sm font-medium text-body-strong">Your name</span>
          <Input
            value={draft.about.name}
            onChange={(e) =>
              setDraft((d) => ({ ...d, about: { ...d.about, name: e.target.value } }))
            }
            placeholder="e.g. Aline Uwase"
            required
          />
        </label>
        <label className="min-w-0 space-y-1.5">
          <span className="text-sm font-medium text-body-strong">Email</span>
          <Input
            type="email"
            value={draft.about.email}
            onChange={(e) =>
              setDraft((d) => ({ ...d, about: { ...d.about, email: e.target.value } }))
            }
            placeholder="you@company.com"
            required
          />
        </label>
        <label className="min-w-0 space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium text-body-strong">Country</span>
          <CountrySelect
            value={draft.about.country_code}
            onChange={(entry) =>
              setDraft((d) => ({
                ...d,
                about: { ...d.about, country_code: entry.code, phone_dial_code: entry.dial },
              }))
            }
          />
        </label>
        <label className="min-w-0 space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium text-body-strong">Phone (optional)</span>
          <PhoneInput
            showCountrySelect={false}
            countryCode={draft.about.country_code}
            value={draft.about.phone}
            onChange={(v) => setDraft((d) => ({ ...d, about: { ...d.about, phone: v } }))}
          />
        </label>
        <label className="min-w-0 space-y-1.5">
          <span className="text-sm font-medium text-body-strong">Company (optional)</span>
          <Input
            value={draft.about.company}
            onChange={(e) =>
              setDraft((d) => ({ ...d, about: { ...d.about, company: e.target.value } }))
            }
            placeholder="Where you work"
          />
        </label>
        <label className="min-w-0 space-y-1.5">
          <span className="text-sm font-medium text-body-strong">Role (optional)</span>
          <Input
            value={draft.about.role}
            onChange={(e) =>
              setDraft((d) => ({ ...d, about: { ...d.about, role: e.target.value } }))
            }
            placeholder="e.g. Operations Lead"
          />
        </label>
      </div>
    </div>
  );
}
