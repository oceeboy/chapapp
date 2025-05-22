"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { usePathname } from "next/navigation";

function formatPathName(path: string) {
  const parts = path.split("/").filter(Boolean); // remove empty segments
  const last = parts[parts.length - 1] || "dashboard";
  return last
    .replace(/-/g, " ") // replace hyphens with spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize each word
}
export function PageHeader() {
  const pathname = usePathname();
  const pageTitle = formatPathName(pathname);

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{pageTitle}</h1>
      </div>
      <div className="ml-auto flex items-center gap-2 pr-4 lg:gap-4 lg:pr-6"></div>
    </header>
  );
}
