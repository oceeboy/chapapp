"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRedirectIfAuthenticated() {
  const auth = useAuth();
  const user = auth?.user;
  const loading = auth?.loading;
  const router: AppRouterInstance = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/chat");
    }
  }, [user, loading, router]);
}
