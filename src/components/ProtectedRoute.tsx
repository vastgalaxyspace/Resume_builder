"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { useAuth } from "@/context/AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, pathname, router, user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-6">
        <div className="flex items-center gap-3 rounded-lg border border-[#1E1E2E] bg-[#111118] px-5 py-4 text-[#8888A0]">
          <Loader2 className="size-5 animate-spin text-[#4F8EF7]" />
          Checking your session
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
