"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { BrandLoading } from "@/components/brand-loading";
import { SiteSidebar } from "@/components/site-sidebar";
import { isSellerRole } from "@/lib/api";
import { useMe } from "@/lib/hooks";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: me, isLoading } = useMe();

  useEffect(() => {
    if (!isLoading && !isSellerRole(me?.peran)) router.replace("/home");
  }, [isLoading, me?.peran, router]);

  if (isLoading || !isSellerRole(me?.peran)) return <BrandLoading />;

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <div className="flex flex-1 flex-col md:flex-row">
        <SiteSidebar />

        <main className="flex-1 overflow-y-auto overflow-x-clip pb-20 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
