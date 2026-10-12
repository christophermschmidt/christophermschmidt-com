export type CaseSection = { title: string; paragraphs: string[]; items?: string[] };

export type LeadershipCase = {
  slug: "rti" | "supplier-risk" | "econtrol";
  index: string;
  organization: string;
  context: string;
  title: string;
  cardTitle: string;
  summary: string;
  metric: string;
  introduction: string;
  facts: Array<{ value: string; label: string }>;
  mandate: string;
  responsibility: string;
  organizationalScale: string;
  sections: CaseSection[];
  lesson: string;
  measurementLimitations?: string;
};

export const leadershipCases: LeadershipCase[] = [
  {
    slug: "rti",
    index: "01",
    organization: "Microsoft",
    context: "Real-Time Intelligence",
    title: "Scaling enterprise adoption of Real-Time Intelligence",
    cardTitle: "Scaling a capability into enterprise adoption.",
    summary:
      "Aligning product, engineering, sales, partners, and enablement around enterprise adoption in the United States and Canada.",
    metric: "~5 to ~100 customers in ~24 months",
    introduction:
      "A cross-functional leadership effort connecting a technical capability with enterprise adoption and associated commercial outcomes.",
    facts: [
      { value: "~5 → ~100", label: "Customers adopting Real-Time Intelligence" },
      { value: "< $1M → ~$15M", label: "Associated revenue, not directly owned revenue" },
      { value: "~24 months", label: "United States and Canadian adoption program" },
    ],
    mandate: "Lead United States and Canadian adoption of Microsoft Real-Time Intelligence capabilities.",
    responsibility:
      "I led the adoption effort and connected product, engineering, sales, partners, and technical enablement around the enterprise opportunity.",
    organizationalScale:
      "A cross-functional program spanning Microsoft product and field organizations, partners, and adopting customers.",
    sections: [
      {
        title: "The leadership challenge",
        paragraphs: [
          "This was an adoption and alignment effort, not simply a technology demonstration. The work required translating product capability into relevant enterprise uses and coordinating the groups responsible for bringing it into operation.",
        ],
      },
      {
        title: "The outcome",
        paragraphs: [
          "Over approximately 24 months, adoption grew from roughly five to roughly 100 customers. Associated revenue grew from under $1 million to approximately $15 million.",
          "These are program-associated outcomes. They do not imply that I directly owned all of that revenue or a corresponding profit-and-loss statement.",
        ],
      },
    ],
    lesson:
      "Technical depth is most useful when it helps the organization make a better business decision and carry that decision into operation.",
  },
  {
    slug: "supplier-risk",
    index: "02",
    organization: "Microsoft",
    context: "Enterprise Supplier Risk",
    title: "Bringing supplier-risk assessment forward into onboarding",
    cardTitle: "Bringing supplier-risk assessment forward into onboarding.",
    summary:
      "Reframing a roughly 90-day reporting process around the decisions it needed to support, with operational and analytical workstreams that enabled earlier identification of supplier risk.",
    metric: "~90-day baseline · 25 direct reports · 200+ stakeholders",
    introduction:
      "The mandate was broad: improve supplier risk. I began by diagnosing the operating problem, the decisions people needed to make, and how long it took to obtain a verified, trusted answer.",
    facts: [
      { value: "~90 days", label: "Current-state reporting cycle" },
      { value: "25", label: "Direct reports" },
      { value: "200+", label: "Engineering, architecture, and business stakeholders" },
    ],
    mandate: "Improve supplier risk by making risk information more useful at the point of decision.",
    responsibility:
      "I set priorities, organized the team, chose the architecture, and stopped unnecessary work. I separated operational problems from analytical problems so each could receive the right ownership and response.",
    organizationalScale:
      "I led 25 direct reports and coordinated initiatives across more than 200 engineering, architecture, and business stakeholders. Those are distinct populations.",
    sections: [
      {
        title: "Diagnose the operating problem",
        paragraphs: [
          "The current-state investigation established an approximately 90-day reporting cycle and inadequate visibility into which suppliers represented risk and the exposure they could create.",
          "I examined what the business needed to know, which tools and systems users worked in, how they preferred to work, and where the process failed to provide useful visibility. The aim was to meet people where they worked without imposing a technology-first answer.",
        ],
      },
      {
        title: "Organize the response",
        paragraphs: [
          "I organized the approach in three phases and divided implementation into separate operational and analytical workstreams.",
        ],
        items: [
          "Establish what could be known from the data already available, including its limits.",
          "Identify the known unknowns and keep important unanswered business questions visible.",
          "Implement the operational and analytical changes needed to address the identified problems and gaps.",
        ],
      },
      {
        title: "Represent risk without false precision",
        paragraphs: [
          "We replaced a disputed single-value risk score with tiered classifications based on supplier risk characteristics. The design made the representation more useful to the business without presenting an unsupported probability or a level of precision the evidence did not justify.",
        ],
      },
      {
        title: "Connect data quality to operational correction",
        paragraphs: [
          "I created a data-quality dashboard that did more than identify issues. Data-quality findings were connected to recommended upstream corrections for operational users, linking analytical visibility to the people positioned to improve the source process.",
          "The dashboard connected findings with recommended corrections for operational users; it did not automatically execute those corrections.",
        ],
      },
      {
        title: "Bring the decision forward",
        paragraphs: [
          "Onboarding inputs could be used to classify prospective suppliers and identify riskier ones before they entered Microsoft's system. The outcome was earlier decision support during onboarding, rather than a claim about a specific report-generation turnaround.",
        ],
      },
    ],
    lesson:
      "Start with the decision the business needs to make. Establish what the evidence can support, expose what remains unknown, and organize the operational and analytical changes needed to improve that decision.",
  },
  {
    slug: "econtrol",
    index: "03",
    organization: "Precision eControl",
    context: "Production SaaS Modernization",
    title: "Modernizing a production SaaS platform",
    cardTitle: "Changing the economics of a production platform.",
    summary:
      "Modernizing a customer-facing SaaS platform while improving operating economics and daily pipeline performance.",
    metric: "~90% lower operating costs",
    introduction:
      "Platform ownership that connected architectural modernization with operating economics and the performance of customer-facing data capabilities.",
    facts: [
      { value: "~90%", label: "Reduction in operating costs" },
      { value: ">80%", label: "Improvement in daily pipeline performance" },
      { value: "Production SaaS", label: "Customer-facing platform modernization" },
    ],
    mandate: "Lead modernization of Precision eControl’s production SaaS platform.",
    responsibility:
      "I led the modernization and connected platform architecture and engineering decisions with the economics and performance of an operating, customer-facing service.",
    organizationalScale:
      "Production platform ownership across architecture, engineering economics, and customer-facing operational intelligence.",
    sections: [
      {
        title: "The leadership challenge",
        paragraphs: [
          "The modernization needed to improve daily data pipelines and reduce operating costs while preserving the platform’s customer-facing role. Production ownership made operating outcomes more important than the novelty of the architecture.",
        ],
      },
      {
        title: "The outcome",
        paragraphs: [
          "The modernization reduced operating costs by approximately 90% and improved daily pipeline performance by more than 80%.",
        ],
      },
    ],
    lesson:
      "The architecture is a means to a better operating capability, not the result by itself.",
    measurementLimitations:
      "The cost boundary, comparison period, and exact definition of daily pipeline performance still require supporting detail. The performance figure is not presented as latency, throughput, runtime reduction, or a speedup multiplier.",
  },
];

export function getLeadershipCase(slug: LeadershipCase["slug"]) {
  return leadershipCases.find((item) => item.slug === slug)!;
}

export const approachSteps = [
  ["Define the business decision", "Start with a specific business outcome, the people affected, and an accountable owner. Define what the system may read, recommend, or change before choosing the technology."],
  ["Build the foundation it needs", "Establish the meaning, data quality, state, integration, governance, auditability, and observability required for this use. A bounded use case is not a reason to omit a critical control."],
  ["Make operation accountable", "Set governed authority, test failure paths, and name the operating owner. Auditability should explain a decision; observability should reveal whether the system and its controls are working."],
  ["Prove value, then expand", "Measure the result against the intended outcome. Reuse what is proven, reassess what changes, and choose the next use case on evidence rather than extending scope by default."],
] as const;

export const contact = {
  email: "christophermschmidt7@gmail.com",
  linkedin: "https://www.linkedin.com/in/christophermschmidt",
  substack: "https://realtimedispatch.substack.com/",
  gumroad: "https://schmidtster11.gumroad.com/l/dataandaiexecassessment",
};
