import { Container, Section } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { GradientOrb } from "@/components/marketing/gradient-orb";

export default function NotFound() {
  return (
    <Section className="relative overflow-hidden pt-32 lg:pt-40 min-h-[80vh] grid place-items-center">
      <GradientOrb color="rose" className="-top-20 -right-20" size={520} slow />
      <Container className="relative max-w-2xl text-center">
        <p className="font-display text-[140px] leading-none text-ink">404</p>
        <h1 className="mt-2 font-display text-display-xl text-ink">This page is on holiday.</h1>
        <p className="mt-5 text-[18px] text-body leading-relaxed">
          The page you're looking for doesn't exist — or perhaps never did. Let's get you back to something useful.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/" size="lg">Back home</Button>
          <Button href="/solutions" variant="outline" size="lg">Browse solutions</Button>
        </div>
      </Container>
    </Section>
  );
}
