import { CommandCenter } from "@/components/dashboard/command-center";
import { SetupChecklist } from "@/components/onboarding/setup-checklist";

export const pagePrompt =
  "You are on the user's dashboard. They can see their bot instances, setup checklist, and command center. Help them manage their bots or complete setup steps.";

export default function DashboardPage() {
  return (
    <>
      <div className="p-6 pb-0">
        <SetupChecklist />
      </div>
      <CommandCenter />
    </>
  );
}
