import type { Metadata } from "next";
import { LeadershipCasePage } from "../../_components/case-page";
import { getLeadershipCase } from "@/lib/executive-content";
export const metadata: Metadata = { title: "Microsoft Real-Time Intelligence", description: "Scaling enterprise adoption of Microsoft Real-Time Intelligence in the United States and Canada.", alternates: { canonical: "/work/rti" } };
export default function Page() { return <LeadershipCasePage item={getLeadershipCase("rti")} />; }
