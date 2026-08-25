# Evaluation/hallucination-surface reduction

**Pillar:** Semantic Readiness
**Layer:** AI Readiness & Interoperability
**Status:** Scoped
**Prerequisites:** [Canonical metric definitions](Canonical%20metric%20definitions.md), [RAG grounding quality](RAG%20grounding%20quality.md), [Minimum sufficient context](Minimum%20sufficient%20context.md)
**Verified by:** [Shadow mode and staged autonomy](Shadow%20mode%20and%20staged%20autonomy.md), [Decision-outcome feedback](Decision-outcome%20feedback.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → AI Readiness & Interoperability → Evaluation, and "Ten things the platform does not do" → nobody scores whether the agent used the right definition

## Definition

A standing, versioned evaluation capability that measures whether the system answers correctly — including whether it used the right definition, not merely whether it produced a defensible-looking number — together with the deliberate narrowing of the surface on which it can be wrong.

## Why it matters

Two distinct ideas are joined here because they are the two halves of the same control. Evaluation tells you the current error rate; surface reduction lowers the ceiling on what can go wrong. The critical and widely missed point is what gets evaluated: standard LLM evaluation scores groundedness, relevance and safety, and none of those detect the most consequential enterprise failure, which is a fluent, well-grounded answer computed from the wrong measure. Semantic correctness needs its own assertion — the expected value for a known question — and almost nobody has one.

## Failure modes

- Evaluation performed once before launch and never again, while the model, the data and the schema all change weekly.
- Golden sets written by the team that built the system, encoding the same assumptions.
- Groundedness scored, semantic correctness not — the answer cites a real source and used the wrong definition.
- Evaluation against the model rather than against the deployed agent, so query-generation failures are invisible.
- No regression gate, so evaluation produces a report nobody blocks a release on.
- Every model and prompt change re-evaluated manually, so evaluation becomes the bottleneck and is quietly skipped.

## Anti-patterns

- **Vibes-based acceptance.** A demo to stakeholders substituting for measurement, which is the actual state of most production deployments.
- **LLM-as-judge without calibration.** Useful and cheap, and it inherits the failure mode you are trying to detect unless it is calibrated against human labels on a sample.
- **Evaluating breadth instead of consequence.** A thousand general questions scored, and the twenty questions that trigger actions untested.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Quality is judged by inspection and user complaints. |
| 2 | Governed | A test question set exists and is run before major releases. |
| 3 | Contextual | A versioned golden set asserts known-correct values including definition correctness, runs against the deployed agent on every change, and gates release. |
| 4 | Operational | Evaluation runs continuously against production traffic with drift detection; results are segmented by question class and by consequence tier. |
| 5 | Autonomous | The evaluation set extends itself from production failures, and a regression automatically blocks or rolls back the change that caused it. |

## Diagnostic question

*What is your agent's current accuracy, when was it last measured, and does the measurement check that it used the right definition?*

1. We haven't measured it.
2. We have a test set we run before major releases.
3. A versioned golden set including definition correctness runs against the deployed agent and gates release.
4. Evaluation runs continuously on production traffic with drift detection and consequence-tier segmentation.
5. The set self-extends from failures and regressions trigger automatic rollback.

## Evidence to request

- The golden set: the questions, expected values, and who authored them.
- The last run, with results by question class.
- The gate — the actual pipeline configuration that blocks a release on regression.
- Evidence that the evaluation targets the deployed agent, not the underlying model.
- The subset of evaluation questions covering actions rather than answers.

## Verification

Ask for the current accuracy number and the date it was measured. If either is missing the capability is at 1. Then read ten golden questions and check whether any assert a specific expected value versus merely checking that an answer was produced — the ratio between those two kinds of test is the real score, and assertion-free tests are extremely common.

## Article angle

The high-value argument is the one nobody makes: existing evaluation tooling does not test the thing enterprise cares about. Groundedness, toxicity and relevance are all model-quality dimensions, and the enterprise failure is definitional. Naming "semantic correctness evaluation" as a distinct and unserved category is a genuine positioning wedge and it is the technical foundation of the Enterprise Decision Benchmark product.

## Sources

- [Evaluating Retrieval Augmented Generation using RAGAS](https://superlinked.com/blog/evaluating-retrieval-augmented-generation-ragas) — the standard metric set, and by omission the argument this page makes: faithfulness and relevancy do not detect an answer that is well-grounded in the wrong measure.
- [BADGER: Bridging Agentic and Deterministic Evaluation for Generative Enterprise Reasoning](https://arxiv.org/pdf/2606.02109) — evaluation that asserts deterministic expected values for enterprise reasoning tasks, which is the shape semantic-correctness testing has to take.
- [Text-to-SQL Benchmarks for Enterprise Realities](https://openreview.net/pdf?id=gXkIkSN2Ha) — the accuracy collapse between academic and enterprise conditions, which is why pre-launch evaluation on a curated set predicts almost nothing about production.
