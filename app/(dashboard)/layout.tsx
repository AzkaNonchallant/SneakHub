import { SiteSidebar } from "@/components/site-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1">
      <SiteSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}