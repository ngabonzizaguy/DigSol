import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { GradientOrb } from "@/components/marketing/gradient-orb";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Thank you",
  description: "We've received your message.",
};

export default function ThankYouPage() {
  return (
    <Section className="relative overflow-hidden pt-32 lg:pt-40 min-h-[80vh] grid place-items-center">
      <GradientOrb color="mint" className="-top-20 -left-20" size={520} slow />
      <GradientOrb color="lavender" className="-bottom-32 right-0" size={480} />
      <Container className="relative max-w-2xl text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-surface-card border border-hairline-strong">
          <Check className="h-6 w-6 text-success" />
        </div>
        <h1 className="mt-6 font-display text-display-xl text-ink text-balance">Thanks — we'll be in touch.</h1>
        <p className="mt-5 text-[18px] text-body text-pretty leading-relaxed">
          We respond to every message within one business day. While you wait, you might enjoy our latest field notes.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/insights" size="lg">Read insights</Button>
          <Button href="/work" variant="outline" size="lg">See our work</Button>
        </div>
      </Container>
    </Section>
  );
}
