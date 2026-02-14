import { SuspensionBanner } from "@/components/billing/suspension-banner";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-auto">
        <SuspensionBanner />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
