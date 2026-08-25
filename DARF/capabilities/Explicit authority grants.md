# Explicit authority grants

**Pillar:** Operational Readiness
**Layer:** Policy
**Status:** Scoped
**Prerequisites:** [Agent identity and delegation](Agent%20identity%20and%20delegation.md)
**Verified by:** [Action scoping](Action%20scoping.md), [Accountability trails](Accountability%20trails.md), [Policy-as-code patterns](Policy-as-code%20patterns.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Policy → Explicit authority grants (coverage: partial), and "Ten things the platform does not do" → business-authority policy-as-code

## Definition

A recorded statement, per agent and per action class, of what the agent is permitted to do, who in the business granted that permission, on what date, under what conditions, and when the grant expires or is reviewed. Authority here is business authority, distinct from and additional to technical permission.

## Why it matters

Technical permission answers "can the system do this." Business authority answers "is the system allowed to." Enterprises conflate them, which means the answer to "who decided the agent could issue credits up to $5,000" is an IAM role assignment made by an engineer during implementation. That is not a governance failure of process, it is the absence of the artifact governance requires: no named grantor, no conditions, no expiry, nothing to review. Every regulated customer will ask this question and almost none of them can currently answer it about their own pilots.

## Failure modes

- Authority is implied by a technical permission grant with no business record.
- The grantor is a team or a role rather than a person who can be asked why.
- Grants have no expiry, so a permission granted for a pilot persists into production and beyond.
- Conditions exist in someone's understanding — "only during business hours," "only for accounts under a threshold" — and nowhere in the system.
- Authority granted at the agent level rather than per action class, so adding a tool silently widens what the grant covers.
- No record of the risk assessment or the business case that justified the grant.

## Anti-patterns

- **The permission matrix as the grant record.** An access control list records capability, not authorization. They are different artifacts answering different questions to different auditors.
- **Blanket authority with a promise of care.** "The agent can do anything in this system; we'll monitor it."
- **Approval in a chat thread.** Real, common, and not retrievable eighteen months later when it matters.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Authority is whatever the technical permissions allow. No business record exists. |
| 2 | Governed | Grants are documented with a named business owner and an approval record per agent. |
| 3 | Contextual | Grants are per action class, name a person, state conditions and an expiry, and the runtime enforces the grant rather than a separately configured permission. |
| 4 | Operational | Grants are reviewed on a cycle, usage is measured against grant scope, and unused authority is reported for reduction. |
| 5 | Autonomous | Grants expire and re-approve automatically, scope is right-sized from observed use, and an action outside an active grant cannot execute. |

## Diagnostic question

*Who, by name, authorized your agent to take its most consequential action — and where is that recorded?*

1. Nobody specifically; it follows from the technical permissions.
2. There's a documented approval with a business owner named.
3. Grants are per action class with named grantor, conditions and expiry, enforced at runtime.
4. Grants are reviewed on a cycle and usage is measured against scope.
5. Grants self-expire and right-size; out-of-grant actions cannot execute.

## Evidence to request

- The grant record for the most consequential action, with grantor, date, conditions and expiry.
- The mapping from grant records to enforced runtime configuration — the artifact showing they are the same thing.
- The review cycle and the last review's outcomes.
- Usage against grant scope: which granted actions have never been used.

## Verification

Ask for the grant record by name and read the grantor field. Then ask that person, if available, what conditions they attached — and compare their answer to what the runtime enforces. The divergence between remembered conditions and enforced conditions is the finding, and it exists in nearly every deployment because the conversation and the configuration were separate events.

## Aviation parallel

Authority in the cockpit is explicit, bounded and situational: pilot-in-command authority is defined in regulation, delegated authority is briefed before it is exercised, and both are constrained by conditions the crew states out loud. The relevant contrast is that aviation treats "who may do what, under what conditions" as a primary artifact, while enterprises treat it as an implementation detail of access control.

## Article angle

The strongest opening piece for the Policy layer because the question is so simple and so rarely answerable. The whole essay can be a single question asked of a real deployment — name the person who authorized this — followed by what it means that nobody can. It also lands directly on the regulatory frame, where demonstrable human oversight is now an obligation rather than a practice.

## Sources

- [EU AI Act, Article 14 — Human Oversight](https://artificialintelligenceact.eu/article/14/) — the obligation that oversight measures be scaled to the system's autonomy level and use context, which presupposes that authority has been declared per action class rather than implied by access.
- [ABAC with Open Policy Agent](https://www.osohq.com/learn/abac-with-open-policy-agent-opa) — the PEP/PDP separation described in NIST SP 800-162, which is the architectural distinction between a technical permission and an evaluated authorization.
