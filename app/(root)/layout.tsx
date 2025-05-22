"use client";
import { SideBar } from "@/components/navigation";
import { PageHeader } from "@/components/shared";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>
          <Toaster richColors />
          <SideBar variant="inset" />
          <SidebarInset>
            <section>
              <PageHeader />
              <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                  <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <main>{children}</main>
                  </div>
                </div>
              </div>
            </section>
          </SidebarInset>
        </SidebarProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}
