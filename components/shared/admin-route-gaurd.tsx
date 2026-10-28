"use client";

import { useUserContext } from "@/contexts/user/user-context";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ADMIN_ROLES = new Set(["admin", "staff"]);

const AdminRouteGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, isUserLoading } = useUserContext();
  const canAccessAdmin = user ? ADMIN_ROLES.has(user.role) : false;

  useEffect(() => {
    if (isUserLoading) return;

    if (!user) {
      router.replace("/sign-in");
      return;
    }

    if (!canAccessAdmin) {
      router.replace("/");
    }
  }, [canAccessAdmin, isUserLoading, router, user]);

  if (isUserLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Checking access...
        </div>
      </div>
    );
  }

  if (!user || !canAccessAdmin) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Redirecting...
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRouteGuard;
