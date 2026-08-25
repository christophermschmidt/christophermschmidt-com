# Automation authority and handback

**Pillar:** Operational Readiness
**Layer:** Policy
**Status:** Scoped
**Prerequisites:** [Explicit authority grants](Explicit%20authority%20grants.md), [Scoped limits](Scoped%20limits.md)
**Verified by:** [Escalation paths](Escalation%20paths.md), [Shadow mode and staged autonomy](Shadow%20mode%20and%20staged%20autonomy.md), [Decision logging](Decision%20logging.md)
**Microsoft implementation:** not mapped in the reference architecture — Foundry and Copilot Studio provide approval interrupts as a primitive; the authority ladder, the handback contract and the competence question are entirely a build

## Definition

A declared ladder of automation levels per decision class — from advisory, through recommend-and-confirm, to act-and-notify, to act-autonomously — with explicit criteria for which level applies when, and a designed handback: what the human receives, how much time they have, and what they need in order to actually take control.

## Why it matters

This is the capability that aviation spent forty years and a great deal of blood learning, and enterprise agentic AI is currently reproducing the whole curve from the start. The core finding is counterintuitive and repeatedly demonstrated: the dangerous moment is not the handoff to automation, it is the handback from it. A human who has been supervising a reliable system for six months has lost the situational picture, has been trained by the system's reliability not to question it, and is handed control precisely at the moment the situation exceeded the system's competence — which is to say, at the hardest moment, in the worst possible state of readiness.

Every enterprise deployment with a human approval step has built a handback and almost none have designed one. An approval queue where the human sees a recommendation and two buttons is not oversight; it is a mechanism for collecting a signature. Regulators have begun to say so explicitly.

## Failure modes

- One automation level for everything, usually "human approves," applied identically to trivial and consequential decisions.
- Approval interfaces presenting a recommendation without the evidence, the alternatives considered, or the confidence.
- Approval rates above 95% sustained over time, which indicates the human has become a rubber stamp rather than a control.
- No time budget for the decision, so the human either blocks the process or approves without reading.
- Handback triggered exactly when the case is hardest, with no context transfer and no warning.
- Automation level set once at launch and never raised or lowered as evidence accumulates.
- The reviewing human lacking the domain competence to overrule, so the control exists organizationally and not practically.

## Anti-patterns

- **Human-in-the-loop as a checkbox.** Cited as the safety story, implemented as a queue, measured by throughput.
- **Confirmation without evidence.** The most common design, and the one that guarantees automation complacency.
- **Escalating only on the model's own uncertainty.** The failures that matter are the ones where the system was confident and wrong; self-reported confidence is the wrong trigger on its own.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Either the agent acts or a human approves. The choice was made once, for all cases. |
| 2 | Governed | Automation levels are defined and assigned per use case, and approval steps are documented. |
| 3 | Contextual | A declared ladder maps decision classes to automation levels with stated criteria; handback delivers the evidence, the alternatives, the confidence and a time budget, and the system states which level it is operating at. |
| 4 | Operational | Approval and override rates are measured as an indicator of complacency, handback quality is reviewed against outcomes, and levels are adjusted on evidence. |
| 5 | Autonomous | Automation level adjusts per case against measured competence, handback is triggered by conditions rather than by model self-doubt, and sustained rubber-stamping automatically demotes the level. |

## Diagnostic question

*What does the human see at the moment they are asked to approve, and what is your approval rate?*

1. A recommendation and two buttons; we don't track the rate.
2. Levels are assigned per use case and approvals are documented.
3. A declared ladder with criteria; handback carries evidence, alternatives, confidence and a time budget.
4. Approval and override rates are measured as complacency indicators and levels adjust on evidence.
5. Level adjusts per case; sustained rubber-stamping demotes it automatically.

## Evidence to request

- A screenshot of the actual approval interface.
- Approval rate and override rate over time, per decision class.
- The automation ladder document, with criteria per level.
- The competence definition for reviewers — who is qualified to overrule and how that is established.
- Time-to-decision distribution for approvals; a median of a few seconds tells you what the control is worth.

## Verification

Look at the approval screen and ask whether you could overrule the recommendation from what is displayed. Then ask for the approval rate. A sustained rate above about 95% with a median decision time under ten seconds is a rubber stamp, and it should be written into the gap register in exactly those terms — this is the single most defensible finding in the Policy layer, because the numbers come from the customer's own system.

## Aviation parallel

The whole capability derives from here. AF447 is a handback failure: autopilot disengaged with an unreliable airspeed indication, handing an unfamiliar, degraded aircraft to a crew with no time and no picture. The 737 MAX MCAS failures were undisclosed authority — a system acting with power the crew did not know it had. Mode confusion is the general case: the operator's model of who is flying diverges from reality. Aviation's answers were an explicit authority ladder, mandatory annunciation of which mode is active, currency requirements for the human, and crew resource management running in both directions. Every one of those has an enterprise analogue and none of them are standard practice.

## Article angle

The highest-value single piece in the entire framework, and the one nobody else is positioned to write. It is the aviation content's strongest material meeting a live regulatory requirement for demonstrable human oversight, on a subject where the industry's current answer — an approval queue — is visibly inadequate once named. The line that carries it: you did not build human oversight, you built a signature collector, and here is the number from your own system that proves it.

## Sources

- [Humans and Automation: Use, Misuse, Disuse, Abuse](https://journals.sagepub.com/doi/10.1518/001872097778543886) — Parasuraman and Riley's foundational paper. Its levels-of-automation model and its treatment of misuse through over-reliance are the direct ancestors of the authority ladder on this page.
- [Autopilot, Mind Wandering, and the Out of the Loop Performance Problem](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5633607/) — the empirical basis for the handback claim: supervisory monitoring degrades situation awareness and skill, so control is returned to an operator least equipped to receive it.
- [EU AI Act, Article 14 — Human Oversight](https://artificialintelligenceact.eu/article/14/) — requires that overseers can understand the system's limitations, remain aware of automation bias, and intervene. An approval queue with two buttons does not satisfy any of the three.
- [Learning from AF447: Human-machine interaction](https://www.sciencedirect.com/science/article/abs/pii/S0925753518303163) — the accident read as an interaction-design failure rather than a piloting one.
