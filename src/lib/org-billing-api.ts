import type { Invoice } from "./api";
import { trpcVanilla } from "./trpc";

// ---- Exported types ----

export interface OrgCreditBalance {
  balance: number;
  dailyBurn: number;
  runway: number | null;
}

export interface OrgMemberUsageRow {
  memberId: string;
  name: string;
  email: string;
  creditsConsumed: number;
  lastActiveAt: string | null;
}

// ---- API calls ----

export async function getOrgCreditBalance(orgId: string): Promise<OrgCreditBalance> {
  const res = await trpcVanilla.org.orgBillingBalance.query({ orgId });
  return {
    balance: (res?.balanceCents ?? 0) / 100,
    dailyBurn: (res?.dailyBurnCents ?? 0) / 100,
    runway: res?.runwayDays ?? null,
  };
}

export async function getOrgMemberUsage(orgId: string): Promise<{
  orgId: string;
  periodStart: string;
  members: OrgMemberUsageRow[];
}> {
  const res = await trpcVanilla.org.orgMemberUsage.query({ orgId });
  const members = Array.isArray(res?.members) ? res.members : [];
  return {
    orgId: res?.orgId ?? orgId,
    periodStart: res?.periodStart ?? "",
    members: (
      members as Array<{
        memberId?: string;
        name?: string;
        email?: string;
        creditsConsumedCents?: number;
        lastActiveAt?: string | null;
      }>
    ).map((m) => ({
      memberId: m.memberId ?? "",
      name: m.name ?? "",
      email: m.email ?? "",
      creditsConsumed: (m.creditsConsumedCents ?? 0) / 100,
      lastActiveAt: m.lastActiveAt ?? null,
    })),
  };
}

export async function getOrgBillingInfo(orgId: string) {
  const res = await trpcVanilla.org.orgBillingInfo.query({ orgId });
  return {
    paymentMethods: Array.isArray(res?.paymentMethods) ? res.paymentMethods : [],
    invoices: Array.isArray(res?.invoices)
      ? (res.invoices as Invoice[]).map((inv) => ({
          id: inv.id ?? "",
          date: inv.date ?? "",
          amount: inv.amount ?? 0,
          status: inv.status ?? ("paid" as const),
          downloadUrl: inv.downloadUrl ?? "",
          hostedUrl: inv.hostedUrl ?? "",
          hostedLineItems: inv.hostedLineItems,
        }))
      : ([] as Invoice[]),
  };
}

export async function createOrgTopupCheckout(
  orgId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string,
) {
  return trpcVanilla.org.orgTopupCheckout.mutate({ orgId, priceId, successUrl, cancelUrl });
}

export async function removeOrgPaymentMethod(
  orgId: string,
  paymentMethodId: string,
): Promise<{ removed: boolean }> {
  return trpcVanilla.org.orgRemovePaymentMethod.mutate({ orgId, paymentMethodId });
}

export async function createOrgSetupIntent(orgId: string): Promise<{ clientSecret: string }> {
  const result = await trpcVanilla.org.orgSetupIntent.mutate({ orgId });
  if (!result?.clientSecret || typeof result.clientSecret !== "string") {
    throw new Error("orgSetupIntent: missing clientSecret in response");
  }
  return result as { clientSecret: string };
}
