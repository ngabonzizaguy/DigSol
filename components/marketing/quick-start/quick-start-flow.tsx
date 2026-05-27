"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { isValidPhoneNumber } from "libphonenumber-js";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuickStart } from "./quick-start-provider";
import { TOTAL_STEPS } from "./quick-start-types";
import { submitQuickStartWithAttachments } from "@/lib/forms/quick-start-submit-client";
import { StepWelcome } from "./steps/step-welcome";
import { StepAbout } from "./steps/step-about";
import { StepNeeds } from "./steps/step-needs";
import { StepDetails } from "./steps/step-details";
import { StepBudget } from "./steps/step-budget";
import { StepContact } from "./steps/step-contact";
import { StepReview } from "./steps/step-review";
import { StepSuccess } from "./steps/step-success";

export type QuickStartFlowVariant = "modal" | "page";

export interface QuickStartFlowProps {
  variant?: QuickStartFlowVariant;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function QuickStartFlow({ variant = "modal" }: QuickStartFlowProps) {
  const {
    draft,
    setDraft,
    nextStep,
    prevStep,
    goToStep,
    config,
    services,
    closeFlow,
    resetDraft,
    attachments,
  } = useQuickStart();
  const reducedMotion = useReducedMotion();
  const [submitting, setSubmitting] = React.useState(false);
  const [reference, setReference] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const progressRef = React.useRef<HTMLDivElement | null>(null);

  // GSAP-driven progress bar fill that animates in lockstep with step changes.
  useGSAP(
    () => {
      if (!progressRef.current) return;
      const pct = Math.min(100, Math.max(0, ((draft.step - 1) / (TOTAL_STEPS - 1)) * 100));
      gsap.to(progressRef.current, {
        width: `${pct}%`,
        duration: reducedMotion ? 0 : 0.5,
        ease: "power2.out",
      });
    },
    { dependencies: [draft.step, reducedMotion] },
  );

  const validateAndAdvance = React.useCallback((): boolean => {
    switch (draft.step) {
      case 1:
        if (!draft.intent) {
          toast.error("Pick one to continue.");
          return false;
        }
        break;
      case 2: {
        const { name, email, country_code, phone } = draft.about;
        if (!name.trim()) {
          toast.error("Your name, please.");
          return false;
        }
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
          toast.error("That email doesn't look right.");
          return false;
        }
        if (!country_code) {
          toast.error("Pick a country.");
          return false;
        }
        if (phone.trim()) {
          const dial = draft.about.phone_dial_code || "";
          if (!isValidPhoneNumber(`${dial}${phone.replace(/[^\d]/g, "")}`)) {
            toast.error("That phone number doesn't look valid.");
            return false;
          }
        }
        break;
      }
      case 3: {
        const hasService = draft.needs.service_slugs.length > 0;
        const hasCustom = draft.needs.custom_request.trim().length > 0;
        if (draft.intent !== "exploring" && !hasService && !hasCustom) {
          toast.error("Pick a service or describe what you need.");
          return false;
        }
        break;
      }
      case 5:
        if (!draft.budget.unsure && draft.budget.min > draft.budget.max) {
          toast.error("Minimum can't be higher than maximum.");
          return false;
        }
        break;
      case 6:
        if (!draft.contact.channel) {
          toast.error("Pick how we should reach you.");
          return false;
        }
        break;
    }
    return true;
  }, [draft]);

  const handleNext = React.useCallback(() => {
    if (validateAndAdvance()) nextStep();
  }, [validateAndAdvance, nextStep]);

  const handleSubmit = React.useCallback(async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        intent: draft.intent ?? "exploring",
        name: draft.about.name,
        email: draft.about.email,
        country_code: draft.about.country_code,
        phone_dial_code: draft.about.phone_dial_code || null,
        phone: draft.about.phone || null,
        company: draft.about.company || null,
        role: draft.about.role || null,
        service_slugs: draft.needs.service_slugs,
        custom_request: draft.needs.custom_request || null,
        description: draft.details.description || null,
        goals: draft.details.goals || null,
        timeline: draft.details.timeline || null,
        links: draft.details.links,
        budget_currency: draft.budget.currency,
        budget_min: draft.budget.unsure ? null : draft.budget.min,
        budget_max: draft.budget.unsure ? null : draft.budget.max,
        budget_unsure: draft.budget.unsure,
        preferred_channel: draft.contact.channel || "email",
        preferred_window: draft.contact.window || null,
      };

      const result = await submitQuickStartWithAttachments(payload, attachments);
      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      if (result.attachmentWarnings?.length) {
        toast.warning("Request saved, but some attachments could not be uploaded.", {
          description: result.attachmentWarnings[0],
        });
      }
      setReference(result.reference);
      goToStep(TOTAL_STEPS);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong. Try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }, [draft, goToStep, attachments]);

  const handleClose = React.useCallback(() => {
    if (reference) {
      // After successful submit, also clear the draft so a new visit starts clean.
      resetDraft();
    }
    closeFlow();
  }, [closeFlow, reference, resetDraft]);

  const transition = reducedMotion ? { duration: 0 } : { duration: 0.45, ease: EASE };
  const motionProps = reducedMotion
    ? { initial: false, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 0 } }
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -16 },
      };

  const stepIsSuccess = draft.step === TOTAL_STEPS;

  return (
    <div
      className={cn(
        "flex min-w-0 w-full flex-col gap-6",
        variant === "page" && "mx-auto max-w-3xl",
      )}
    >
      {/* Progress chrome */}
      {!stepIsSuccess && (
        <div aria-label="Progress" className="space-y-2">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted">
            <span>
              Step {draft.step} of {TOTAL_STEPS - 1}
            </span>
            <span className="text-muted-soft">{stepLabel(draft.step)}</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-hairline">
            <div ref={progressRef} className="h-full rounded-full bg-ink" style={{ width: "0%" }} />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={draft.step}
          {...motionProps}
          transition={transition}
          className="min-h-[240px]"
        >
          {draft.step === 1 && <StepWelcome />}
          {draft.step === 2 && <StepAbout />}
          {draft.step === 3 && <StepNeeds services={services} />}
          {draft.step === 4 && <StepDetails />}
          {draft.step === 5 && <StepBudget />}
          {draft.step === 6 && <StepContact />}
          {draft.step === 7 && (
            <StepReview onEditStep={(step) => goToStep(step)} services={services} />
          )}
          {draft.step === 8 && (
            <StepSuccess
              reference={reference ?? "—"}
              whatsappNumber={config.whatsapp.number_e164}
              name={draft.about.name}
              onClose={handleClose}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {!stepIsSuccess && (
        <div className="flex min-w-0 flex-col gap-3 border-t border-hairline pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            {draft.step > 1 ? (
              <Button type="button" variant="ghost" size="md" className="w-full sm:w-auto" onClick={prevStep}>
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            ) : (
              <Button type="button" variant="ghost" size="md" className="w-full sm:w-auto" onClick={closeFlow}>
                Maybe later
              </Button>
            )}
          </div>
          <div className="flex min-w-0 flex-wrap items-stretch justify-end gap-2 sm:items-center">
            {draft.step === 4 && (
              <Button
                type="button"
                variant="link"
                size="md"
                onClick={() => {
                  setDraft((d) => ({
                    ...d,
                    details: { description: "", goals: "", timeline: "", links: [] },
                  }));
                  nextStep();
                }}
              >
                Skip
              </Button>
            )}
            {draft.step < 7 && (
              <Button type="button" size="md" className="w-full sm:w-auto" onClick={handleNext}>
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            {draft.step === 7 && (
              <Button type="button" size="md" className="w-full sm:w-auto" disabled={submitting} onClick={handleSubmit}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {submitting ? "Sending…" : "Send it"}
              </Button>
            )}
          </div>
        </div>
      )}
      {error ? (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function stepLabel(step: number): string {
  switch (step) {
    case 1:
      return "Welcome";
    case 2:
      return "About you";
    case 3:
      return "What you need";
    case 4:
      return "Details";
    case 5:
      return "Budget";
    case 6:
      return "Contact";
    case 7:
      return "Review";
    default:
      return "";
  }
}
