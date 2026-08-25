# Contribution analysis

**Pillar:** Semantic Readiness
**Layer:** Analytical Explainability
**Status:** Scoped
**Prerequisites:** [Canonical metric definitions](Canonical%20metric%20definitions.md), [Grain consistency](Grain%20consistency.md)
**Verified by:** [Narrative-ready model design](Narrative-ready%20model%20design.md), [Filter context correctness](Filter%20context%20correctness.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Analytical Explainability → Contribution analysis (coverage: partial)

## Definition

The model can decompose a change in an aggregate into the contributions of its parts — by dimension, by mix, by rate, by volume — such that the parts reconcile exactly to the whole, and the decomposition method is declared rather than inferred.

## Why it matters

Decomposition is the arithmetic backbone of every explanation an agent gives. If the contributions do not sum to the change, the explanation is not merely imprecise, it is unfalsifiable — the reader cannot tell what is missing. Mix-versus-rate decomposition is where this most often fails: a margin decline attributed to pricing when it was product mix leads to a pricing action that does nothing, and the agent will recommend the pricing action with full confidence because it computed a real number from real data.

## Failure modes

- Contributions that do not sum to the total change, with the remainder unlabelled or quietly absorbed.
- Mix effects and rate effects conflated, so a shift in the composition of the business is reported as a performance change.
- Decomposition performed at a grain where the components are not additive.
- Multiple valid decomposition methods available with no declared default, so two analyzes of the same change disagree.
- Cross-terms in a multi-factor decomposition allocated arbitrarily and never disclosed.
- New or discontinued entities in the period handled inconsistently, producing phantom contributions.

## Anti-patterns

- **Top-N contributors as decomposition.** Listing the five largest movers is a ranking, not a decomposition, and the reader will treat it as complete.
- **Waterfall charts with a plug.** A visual that reconciles because one bar absorbs the error.
- **Letting the agent invent the method.** If the decomposition is computed in the generated query rather than by a governed measure, the method changes per question.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Explanations list large movers. No reconciliation is attempted. |
| 2 | Governed | A decomposition approach is documented and used by the analytics team for standard reviews. |
| 3 | Contextual | Decomposition is implemented as governed model logic that reconciles exactly, with mix and rate separated and the method declared in the output. |
| 4 | Operational | Reconciliation is asserted automatically on every decomposition and a non-reconciling result is suppressed; method choice is logged with the answer. |
| 5 | Autonomous | The system selects and states the appropriate decomposition for the question class, handles entrants and exits explicitly, and refuses to explain a change it cannot decompose. |

## Diagnostic question

*When the system explains a change in a headline number, do the stated contributions add back to the change exactly, and are mix and rate separated?*

1. No — we list the biggest movers.
2. A documented approach exists and the analytics team applies it.
3. Decomposition is governed model logic, reconciles exactly, and separates mix from rate.
4. Reconciliation is asserted automatically and non-reconciling results are suppressed.
5. The system chooses and declares the method, and declines to explain what it cannot decompose.

## Evidence to request

- The decomposition logic — the actual measures or code, not a description.
- A recent explanatory output with the contributions and the total, so reconciliation can be checked.
- How entrants, exits and reclassifications in the period are handled.
- Whether the method used is stated in the output the consumer sees.

## Verification

Take the most recent variance explanation the customer produced and add up the stated contributions. Compare to the actual change. The size of the unexplained residual is the score. Then ask whether the largest stated contributor is a rate effect or a mix effect; if nobody can answer immediately, the separation does not exist in the model.

## Article angle

Best treated as the technical companion to drivers-versus-correlation: that piece is about whether the explanation is causal, this one is about whether it is even arithmetically complete. The sharp observation is that agents make decomposition load-bearing for the first time — a human reading a waterfall chart notices the plug bar, and an agent reading the same numbers narrates around it.

## Sources

- [Simpson's Paradox: A Singularity of Statistical and Inductive Inference](https://arxiv.org/pdf/2103.16860) — the formal case for separating mix from rate: an aggregate can move in the opposite direction to every one of its components.
- [Causal inference in statistics: An overview](https://ftp.cs.ucla.edu/pub/stat_ser/r350.pdf) — establishes why a decomposition that reconciles arithmetically still is not an explanation, which is the boundary between this capability and drivers-versus-correlation.

*Literature note:* variance decomposition into price, volume and mix is standard practice in FP&A and has almost no rigorous published treatment. The absence is an opportunity.
