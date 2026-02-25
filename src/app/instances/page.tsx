import { InstanceListClient } from "./instance-list-client";

export const pagePrompt =
  "You are on the bot instances page. The user can see all their WOPR bot instances, create new ones, and manage existing ones. Help with instance management.";

export default function InstancesPage() {
  return (
    <div className="p-6">
      <InstanceListClient />
    </div>
  );
}
