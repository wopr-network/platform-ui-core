"use client";

import { useEffect, useState } from "react";
import type { OrgMember } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { getOrganization } from "@/lib/org-api";

/**
 * Returns the current user's role in the active organization.
 * Returns null while loading or if the user has no org.
 */
export function useMyOrgRole(): OrgMember["role"] | null {
  const { data: session } = useSession();
  const [role, setRole] = useState<OrgMember["role"] | null>(null);

  useEffect(() => {
    if (!session?.user) return;

    let cancelled = false;
    getOrganization()
      .then((org) => {
        if (cancelled) return;
        const me = org.members.find(
          (m) => m.userId === session.user.id || m.email === session.user.email,
        );
        setRole(me?.role ?? null);
      })
      .catch(() => {
        if (!cancelled) setRole(null);
      });

    return () => {
      cancelled = true;
    };
  }, [session?.user]);

  return role;
}

/**
 * Returns true if the current user is an admin or owner of the active organization.
 * Returns false while loading or if the user is a regular member.
 */
export function useIsAdminOrOwner(): boolean {
  const role = useMyOrgRole();
  return role === "admin" || role === "owner";
}
