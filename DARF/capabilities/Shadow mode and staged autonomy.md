# Shadow mode and staged autonomy

**Pillar:** Operational Readiness
**Layer:** Execution
**Status:** Scoped
**Prerequisites:** [Action scoping](Action%20scoping.md), [Automation authority and handback](Automation%20authority%20and%20handback.md), [Evaluation/hallucination-surface reduction](Evaluation%20hallucination-surface%20reduction.md)
**Verified by:** [Decision-outcome feedback](Decision-outcome%20feedback.md), [Decision logging](Decision%20logging.md)
**Microsoft implementation:** not mapped in the reference architecture — no first-party shadow-execution mode exists; the harness, the comparison and the promotion criteria are a build

## Definition

The ability to run an agent against real production traffic while its actions are recorded rather than executed, to compare what it would have done against what actually happened, and to promote it through defined autonomy stages on quantitative criteria rather than on confidence.

## Why it matters

Every other capability in Pillar 2 governs an agent that is already acting. This one governs how it earns the right to act, and it is the answer to the question every risk committee asks and no vendor answers: on what evidence did you decide this was safe. Shadow mode converts that from a judgment call into a measurement, and it does so using the organization's own traffic rather than a test set — which is the only evidence that survives contact with a regulator. Its absence is why so many pilots stall: there is no defined path from "it works in the demo" to "it acts on production," so the decision becomes political.

## Failure modes

- Testing on synthetic or historical data only, which misses the distribution the agent will actually see.
- Binary release — off, then fully on — with no intermediate stage.
- Shadow results reviewed qualitatively rather than scored against a criterion set before the run.
- No defined promotion criteria, so the go-live decision is made by whoever is most confident in the room.
- Shadow mode run for a fixed short period rather than until a sufficient sample of the rare, consequential cases has accumulated.
- No demotion path, so an agent that degrades after promotion stays at its level.
- Shadow comparison against the human baseline treated as the whole story, ignoring that the human baseline is itself unmeasured.

## Anti-patterns

- **Pilot as shadow mode.** A limited-scope live deployment is a small blast radius, not a recorded-but-not-executed run. They test different things.
- **A/B testing an irreversible action.** Splitting live traffic between agent and human is not shadow mode and carries the full risk on the agent's half.
- **Promotion on volume.** "It's handled ten thousand cases without incident" says nothing if the consequential cases are one in fifty thousand.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Agents go from testing to live. There is no intermediate mode. |
| 2 | Governed | A pilot phase with limited scope is used before broad release, with qualitative review. |
| 3 | Contextual | Agents run against real production traffic with actions recorded not executed, decisions are compared to actual outcomes, and promotion follows written quantitative criteria. |
| 4 | Operational | Autonomy stages are defined with entry and exit criteria per stage, sample sufficiency for rare cases is required before promotion, and a demotion path exists and has been used. |
| 5 | Autonomous | Promotion and demotion happen automatically against continuously measured performance, and shadow evaluation continues indefinitely alongside live operation. |

## Diagnostic question

*Before your agent was allowed to act, what evidence did you have that it should be — and on what criteria was that decision made?*

1. It performed well in testing and we turned it on.
2. We ran a limited pilot and reviewed it.
3. It ran in shadow against production traffic, decisions were compared to outcomes, and promotion criteria were written in advance.
4. Autonomy stages have entry and exit criteria, rare-case sample sufficiency is required, and demotion is possible and has happened.
5. Promotion and demotion are automatic against continuous measurement.

## Evidence to request

- The shadow-run results: the agent's would-be decisions against actual outcomes.
- The promotion criteria document, dated before the promotion decision.
- The autonomy stage definitions with entry and exit criteria.
- The rare-case analysis — how many consequential cases the shadow period actually contained.
- Any record of a demotion.

## Verification

Ask for the promotion criteria and check the date against the promotion. Criteria written after the decision are a rationalisation, and this is common enough to be worth checking every time. Then ask how many high-consequence cases occurred during the shadow period; if the answer is none or unknown, the shadow run measured the agent's performance on easy cases only, which is precisely the wrong evidence.

## Aviation parallel

Type rating and currency are the direct analogue: an operator does not fly a type because they are competent in general, they fly it because they have demonstrated specific competence on that type and continue to demonstrate it at intervals. Certification is also staged and evidence-based rather than binary, and it can be withdrawn. Enterprises grant agent autonomy the way nobody grants a type rating — once, on impression, permanently.

## Article angle

The missing step between pilot and production, and the piece that most directly serves the buyer's actual anxiety. It also carries the framework's best structural argument: autonomy should be earned against measured evidence in stages, which is simultaneously the safest position and the fastest one, because staged promotion with criteria unblocks decisions that indefinite deliberation does not. That is the rare essay that argues for more caution and more speed at the same time.

## Sources

- [Shadow Deployment for ML Models: Strategy, Patterns and Risks](https://atlan.com/know/shadow-deployment-for-ml-models/) — the mechanism: real production traffic, recorded outputs, no user impact, with promotion criteria defined before the observation window opens.
- [Shadow deployment vs. canary release of machine learning models](https://www.qwak.com/post/shadow-deployment-vs-canary-release-of-machine-learning-models) — the distinction this capability depends on. A limited-scope pilot is a canary, not a shadow, and the two test different things.
