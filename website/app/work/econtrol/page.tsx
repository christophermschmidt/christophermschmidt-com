import type { Metadata } from "next";
import { LeadershipCasePage } from "../../_components/case-page";
import { getLeadershipCase } from "@/lib/executive-content";
export const metadata: Metadata = { title: "Precision eControl modernization", description: "Modernizing a production SaaS platform to improve operating economics and daily pipeline performance.", alternates: { canonical: "/work/econtrol" } };
export default function Page() { return <LeadershipCasePage item={getLeadershipCase("econtrol")} />; }
