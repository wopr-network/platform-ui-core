"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { OnboardingWizard } from "@/components/onboarding";
import type { WizardMode } from "@/components/onboarding/use-onboarding";

function OnboardingContent() {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const mode: WizardMode = modeParam === "fleet-add" ? "fleet-add" : "onboarding";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <OnboardingWizard mode={mode} />
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={<div className="flex min-h-screen items-center justify-center bg-background" />}
    >
      <OnboardingContent />
    </Suspense>
  );
}
