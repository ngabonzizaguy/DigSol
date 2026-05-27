"use client";

const DEFAULT_PARTNERS = [
  "Greenride Africa",
  "Meridian Financial",
  "Cedar Health",
  "Forge & Field",
  "Loop Analytics",
  "Atlas Foods",
  "Lumen & Co.",
  "Halcyon Bank",
  "Tessera Labs",
  "Brightline",
  "Orbital Logistics",
  "Kinship Health",
];

export function LogoMarquee({ partners }: { partners?: string[] }) {
  const names =
    partners?.map((p) => p.trim()).filter(Boolean).length ? partners!.map((p) => p.trim()).filter(Boolean) : DEFAULT_PARTNERS;
  const doubled = [...names, ...names];

  return (
    <div className="relative mask-fade-edges overflow-hidden">
      <div className="flex w-max animate-marquee gap-12 py-2">
        {doubled.map((name, i) => (
          <div
            key={`${name}-${i}`}
            className="font-display text-[22px] font-light text-muted whitespace-nowrap select-none"
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
