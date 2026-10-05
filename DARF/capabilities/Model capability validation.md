# Model capability validation

**Pillar:** Operational Readiness
**Layer:** Execution
**Status:** Scoped
**Prerequisites:** [Vendor-agnostic execution-layer selection](Vendor-agnostic%20execution-layer%20selection.md), [Action scoping](Action%20scoping.md)
**Verified by:** [Shadow mode and staged autonomy](Shadow%20mode%20and%20staged%20autonomy.md)
**Microsoft implementation:** not mapped in the reference architecture. No first-party task-specific capability validation harness exists in Foundry, Operations Agent, or Copilot Studio evaluation tooling; the eval set, the re-validation trigger, and the failure-rate threshold are a build.

## Definition

The model or agent's capability for a specific delegated action is validated against that action's own real failure modes and repeat volume, not assumed from a general leaderboard score or a vendor's marketing benchmark. A model qualified for one task class is not automatically qualified for another: capability is scoped to the action, not to the model.

## Why it matters

Model capability is real, checkable, and belongs inside Execution, not outside the framework. What the framework actually argues is narrower and more defensible: a validated, capable model still fails in production without State, Policy, and Audit around it, so capability validation is necessary but never sufficient on its own. This is also where "just use a smarter model" gets tested against evidence instead of asserted. General AgentBench found average relative performance drops of 10 to 30 percent when models move from specialized, domain-tuned benchmark settings into a unified general-agent evaluation, with DeepSeek-V3.2 showing roughly 9.5 percent degradation despite strong domain-specific scores. A model's rank on a general or even a different domain-specific benchmark does not transfer cleanly to a new delegated action, which is exactly why this has to be a per-action check, not a one-time model selection.

## Failure modes

- A model is selected for production based on a general benchmark score or leaderboard rank that never tested the actual delegated task.
- Capability was validated once at pilot and never re-validated after a model version upgrade silently changed behavior.
- Single-attempt success rate is mistaken for production reliability, when the action will run thousands of times against varied inputs.
- Capability validated in one favorable domain is assumed to transfer to a materially different task without re-testing.
- No task-specific eval set exists at all. "It seemed fine in the demo" is the entire validation record.

## Anti-patterns

- **Benchmark shopping.** Picking whichever leaderboard makes the chosen model look best, instead of building an eval set from the action's own real failure modes.
- **One-and-done validation.** Treating a capability check as a launch gate instead of a recurring practice, so a silent model upgrade erodes reliability with nobody watching.
- **Confusing fluency with competence.** A model that explains a decision persuasively is not the same as a model whose decision is correct. Validation has to check the outcome, not the narration.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | No task-specific validation exists. The model was chosen because it is the vendor default or scored well on a general leaderboard. |
| 2 | Governed | Task-specific validation happened once, before launch, against a hand-picked sample of cases. |
| 3 | Contextual | A representative eval set built from the action's own real failure modes exists and is run before granting execution authority. |
| 4 | Operational | Validation reruns automatically on model or prompt version changes, and failure rate is tracked against a defined threshold, not just pass or fail at launch. |
| 5 | Autonomous | Capability validation runs continuously against live outcome data and feeds back into the Policy layer's authority grant, so degraded capability automatically narrows what the agent is allowed to do. |

## Diagnostic question

*If the vendor released a new default model version tomorrow, how would you know whether it is still safe to delegate this specific action to it?*

1. We would not know. We would assume it is fine because the general benchmark score went up.
2. We would manually re-test a handful of cases before deciding.
3. We have an eval set built from this action's real failure modes and would rerun it.
4. Validation reruns automatically on version change against a tracked failure-rate threshold.
5. Capability is continuously validated against live outcomes and feeds back into the authority grant automatically.

## Evidence to request

- The eval set used to validate this specific action, and whether it was built from real failure cases or a generic benchmark.
- The last time capability was re-validated, and what triggered it: a scheduled cadence, a model upgrade, or nothing.
- Whether a single-attempt or multi-attempt reliability measure was used to set the go-live threshold.
- Any record of a model version change that was not followed by re-validation.

## Verification

Ask what happens the week a vendor ships a new default model version. If the honest answer is "we would find out from a user complaint," capability validation is not a practice, it is a one-time event that happened to occur before launch. Then ask whether the eval set was built from this organization's own failure modes or borrowed from a public leaderboard. A borrowed eval set validates the model's marketing, not the action.

## Article angle

The useful and unfashionable position: model capability is a real, checkable input to Execution, not a topic the framework avoids talking about. The framework's actual claim is narrower than "model quality doesn't matter": a validated, capable model is still not sufficient without State, Policy, and Audit, and two 2026 papers now supply the empirical version of that argument. General capability gains do not reliably transfer to a specific delegated action, which is the evidence behind the framework's original claim that a smarter model does not close the operational gap on its own.

## Sources

- [General AgentBench: Benchmark Test-Time Scaling of General LLM Agents](https://arxiv.org/html/2602.18998v1), Li, Ming, Setlur, and colleagues, Carnegie Mellon University Language Technologies Institute, 2026-02-22. Shows a 10 to 30 percent average relative performance drop when models move from specialized, domain-tuned benchmark settings to a unified general-agent evaluation, with DeepSeek-V3.2 specifically showing roughly 9.5 percent degradation despite strong domain-specific scores. Direct evidence that a model's benchmark rank does not transfer cleanly to a different delegated action.
- [Beyond pass@1: A Reliability Science Framework for Long-Horizon LLM Agents](https://arxiv.org/abs/2603.29231), Khanal, Tao, and Zhou, 2026-04-01. Argues that single-attempt success rate, the metric most public benchmarks report, systematically overstates the reliability an agent will show across the many repeated attempts a production action actually requires, and proposes multi-attempt reliability measures instead. The paper's specific per-task figures were not independently verified for this page; cite the general finding, confirm exact numbers before quoting them elsewhere.
