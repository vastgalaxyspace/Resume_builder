"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AuthNavButton() {
  const { loading, logout, user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await logout();
      setOpen(false);
      router.replace("/login");
    } finally {
      setLoggingOut(false);
    }
  }

  if (loading) {
    return <div className="h-10 w-24 rounded-lg bg-[#111118]" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 text-sm text-[#8888A0] transition-colors hover:text-[#F0F0F5]"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden max-w-[160px] truncate text-sm text-[#8888A0] sm:block">
        {user.displayName || user.email}
      </span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-lg border border-[#1E1E2E] bg-[#111118] text-[#8888A0] transition-all duration-200 hover:border-[#4F8EF7] hover:text-[#F0F0F5]"
            aria-label="Sign out"
          >
            <LogOut size={17} />
          </button>
        </DialogTrigger>
        <DialogContent className="border-[#1E1E2E] bg-[#111118] text-[#F0F0F5]">
          <DialogHeader>
            <DialogTitle>Confirm logout</DialogTitle>
            <DialogDescription className="text-[#8888A0]">
              Are you sure you want to log out of your ResumeIQ account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={loggingOut}
              className="rounded-lg border border-[#1E1E2E] bg-transparent px-4 py-2 text-sm text-[#8888A0] transition-all duration-200 hover:border-[#4F8EF7] hover:text-[#F0F0F5] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-lg bg-[#EF4444] px-4 py-2 text-sm text-white transition-all duration-200 hover:bg-[#DC2626] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loggingOut ? "Logging out" : "Logout"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
