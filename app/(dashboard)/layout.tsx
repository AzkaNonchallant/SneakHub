import { SiteSidebar } from "@/components/site-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col md:flex-row">
      <SiteSidebar />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">{children}</main>
    </div>
  );
}