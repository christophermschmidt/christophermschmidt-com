# Drivers vs. correlation

**Pillar:** Semantic Readiness
**Layer:** Analytical Explainability
**Status:** Scoped
**Prerequisites:** [Lineage](Lineage.md), [Canonical metric definitions](Canonical%20metric%20definitions.md)
**Verified by:** [Evaluation/hallucination-surface reduction](Evaluation%20hallucination-surface%20reduction.md), [Decision-outcome feedback](Decision-outcome%20feedback.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Analytical Explainability → Drivers vs. correlation, and "Ten things the platform does not do" → nothing labels the difference

## Definition

The model distinguishes between relationships that are known causal drivers, relationships that are statistical associations, and relationships that are structural artifacts of how the data was assembled — and that distinction is carried to whatever consumes the analysis.

## Why it matters

An agent asked "why did margin fall" will produce an answer. The mechanism producing it is correlation search, and the output is phrased as explanation. When that explanation feeds a recommendation, and the recommendation feeds an action, a statistical association has been silently promoted to a causal claim with budget attached. This is the point where Pillar 1 stops being an accuracy concern and becomes an operational risk, because the system will act on the spurious driver exactly as readily as on the real one.

## Failure modes

- Key-influencer and driver-analysis features presented in an executive surface with no causal caveat.
- Structural correlations — anything downstream of the same denominator, anything sharing a seasonality — surfaced as drivers.
- The agent's narrative uses causal language ("driven by," "because of," "caused") for associative findings.
- A known causal relationship established by an experiment is not recorded anywhere the agent can reach, so the system rediscovers it as a correlation.
- No confounder registry, so the same confound is rediscovered as a finding every quarter.

## Anti-patterns

- **A disclaimer in the footer.** "Correlation does not imply causation" printed under a chart whose title says "top drivers of churn."
- **Model complexity as a substitute for identification.** A gradient-boosted attribution is still associative; feature importance is not a causal estimand.
- **Treating the distinction as an analyst's job.** It survives exactly as long as an analyst is in the loop, which under agents is not at all.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Correlation is presented as explanation. No distinction is made. |
| 2 | Governed | Analysts are expected to distinguish, and causal claims in published analysis are reviewed. |
| 3 | Contextual | The model carries a typed distinction — causal, associative, structural — per relationship, and the answer surface renders associative findings in associative language. |
| 4 | Operational | A register of established causal relationships and known confounders exists, is maintained from experiments and interventions, and is consulted by the analysis path; misattribution rate is reviewed. |
| 5 | Autonomous | Causal claims are only emitted where an identification strategy exists; everything else is emitted as association with its confounders named, without a human enforcing it. |

## Diagnostic question

*When the system explains why a metric moved, how does the consumer know whether that explanation is causal or associative?*

1. They don't — the explanation reads as causal either way.
2. Analysts are expected to distinguish and reviews catch the worst cases.
3. Relationships are typed as causal, associative or structural, and language on the answer surface follows the type.
4. A causal and confounder register exists, is maintained from real experiments, and is consulted by the analysis path.
5. Causal claims require an identification strategy; everything else self-labels as association.

## Evidence to request

- The last three "why did X change" outputs produced for an executive audience, verbatim.
- The causal register or its absence — which relationships the organization considers established, and on what evidence.
- The list of experiments or interventions run in the last year that could support a causal claim.
- The prompt or template governing how the agent phrases explanatory findings.

## Verification

Read the actual language of recent explanatory outputs. Count causal verbs. Then ask which of the named drivers has ever been tested by an intervention. The usual answer is none, which places the capability at 1 regardless of the sophistication of the analytics behind it. This is the fastest capability in the framework to score honestly and one of the most uncomfortable to present.

## Aviation parallel

Accident investigation distinguishes causal factors from contributing factors from findings, and the distinction is procedural, not stylistic — an NTSB report cannot promote a contributing factor to a cause without the evidence to support it. Enterprise analytics has no equivalent discipline and no equivalent vocabulary, which is why every root-cause deck is really a correlation deck.

## Article angle

Already the strongest scoped capability in Analytical Explainability and a natural essay. The argument that makes it more than a statistics lecture: correlation-as-explanation was survivable when a human read the chart and applied judgment. Agentic systems convert the explanation directly into an action, which is the moment a well-known epistemic sloppiness starts costing money.

## Sources

- [Causal inference in statistics: An overview](https://ftp.cs.ucla.edu/pub/stat_ser/r350.pdf) — Pearl's own summary. The load-bearing point for this capability is that statistical association, however sophisticated the estimator, does not license an interventional claim, which is exactly what a recommendation is.
- [Simpson's Paradox: A Singularity of Statistical and Inductive Inference](https://arxiv.org/pdf/2103.16860) — the canonical demonstration that an association can reverse sign under stratification, which is why an unlabelled driver finding is not merely imprecise but potentially backwards.
