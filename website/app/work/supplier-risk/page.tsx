import type { Metadata } from "next";
import { LeadershipCasePage } from "../../_components/case-page";
import { getLeadershipCase } from "@/lib/executive-content";
export const metadata: Metadata = { title: "Microsoft Enterprise Supplier Risk", description: "Bringing supplier-risk assessment forward into onboarding through business diagnosis, operational and analytical workstreams, and accountable delivery.", alternates: { canonical: "/work/supplier-risk" } };
export default function Page() { return <LeadershipCasePage item={getLeadershipCase("supplier-risk")} />; }
