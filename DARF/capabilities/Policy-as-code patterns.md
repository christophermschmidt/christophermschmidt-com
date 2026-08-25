# Policy-as-code patterns

**Pillar:** Operational Readiness
**Layer:** Policy
**Status:** Scoped
**Prerequisites:** [Explicit authority grants](Explicit%20authority%20grants.md), [Scoped limits](Scoped%20limits.md)
**Verified by:** [Action scoping](Action%20scoping.md), [Decision logging](Decision%20logging.md), [Accountability trails](Accountability%20trails.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Policy → Policy-as-code patterns, and "Ten things the platform does not do" → business-authority policy-as-code (Microsoft ships infrastructure policy, not business policy)

## Definition

Business policy — authority, limits, conditions, admissibility, escalation triggers — expressed as versioned, testable, executable code evaluated at runtime by a component the agent cannot bypass, rather than as a document humans are expected to follow.

## Why it matters

This is the capability that makes the rest of the Policy layer real. Grants, limits and escalation criteria that exist only as prose are enforced by whoever remembers them, which under agents means nobody. Encoding them buys four things at once: the policy can be tested, it can be versioned so you know what was in force when, it can be evaluated identically on every path, and its evaluation can be logged — which is what turns policy into audit evidence. The distinction that matters commercially is that infrastructure policy-as-code is mature and widely deployed, while *business*-authority policy-as-code barely exists as a product category. That gap is the most defensible piece of margin in the entire offer portfolio.

## Failure modes

- Policy in documents, enforcement in scattered application code, with no way to prove they correspond.
- The same rule implemented differently in three services, diverging over time.
- Policy embedded in agent prompts, so the constrained component is also the enforcing one.
- No policy versioning, so the rule in force at the time of a past decision cannot be recovered.
- Policy evaluation not logged, so a decision's compliance cannot be demonstrated after the fact.
- Policy authored solely by engineers, so the business owner cannot read, review or approve what was implemented.
- A bypass path — an emergency override, a direct API, an admin route — that skips evaluation entirely.

## Anti-patterns

- **Infrastructure policy tooling repurposed without a business-readable layer.** Technically sound, and the compliance officer cannot review it, which defeats the purpose.
- **Policy as configuration.** A settings file with thresholds is better than prose and is not testable, versioned policy.
- **Enforcement at one chokepoint with three known bypasses.** Documented exceptions become the normal path within a quarter.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Policy is prose. Enforcement is ad hoc and inconsistent. |
| 2 | Governed | Policies are documented and consistently configured in the systems that support it. |
| 3 | Contextual | Business policy is versioned executable code evaluated at runtime by a component outside the agent, on every path, with no bypass; the business owner can read and approve the rule. |
| 4 | Operational | Policies have test suites, evaluations are logged with their outcome and the policy version, and coverage against the documented policy set is measured. |
| 5 | Autonomous | Policy changes are tested against historical decisions before release, conflicts and dead rules are detected automatically, and an unevaluated action path cannot exist. |

## Diagnostic question

*Where does your business policy live, who can read it, and can you prove which version was in force for a decision made in March?*

1. In documents; enforcement is wherever someone implemented it.
2. Documented and configured consistently where systems allow.
3. Versioned executable code evaluated outside the agent on every path, readable by the business owner.
4. Policies have tests, evaluations are logged with version and outcome, coverage is measured.
5. Changes are back-tested against historical decisions and conflicts are detected automatically.

## Evidence to request

- The policy repository, with commit history.
- The runtime evaluation point and the enumerated list of paths that reach the action without passing it.
- Policy test suite and its last run.
- A logged policy evaluation from a real decision, including the policy version.
- The business owner's approval record for the current policy version.

## Verification

Ask to see the policy repository and check two things: whether a non-engineer could read a rule, and whether the commit history shows business-owner review. Then ask for a policy evaluation record from a specific past decision. A system that enforces policy correctly but does not log the evaluation caps at 3 — enforcement without a record is a control you cannot demonstrate, and demonstration is the entire point under the current regulatory regime.

## Aviation parallel

Checklists and the minimum equipment list are policy-as-code executed by humans: versioned, tested against real incidents, mandatory, and with completion recorded. The important property is not that they exist but that compliance is evidenced — a checklist that is followed and not recorded is indistinguishable, after an accident, from one that was skipped.

## Article angle

The commercial center of Pillar 2 and the clearest gap in the vendor landscape: infrastructure policy-as-code is a solved, crowded category and business-authority policy-as-code is essentially unserved. The argument that opens it is the March question — prove which rule was in force — because it is simple, universally applicable, and the answer is almost always no.

## Sources

- [Open Policy Agent](https://www.openpolicyagent.org/) — the reference implementation of the pattern: policy as a separate versioned artifact evaluated at runtime by a component the application does not control.
- [ABAC with Open Policy Agent](https://www.osohq.com/learn/abac-with-open-policy-agent-opa) — the PEP/PDP separation from NIST SP 800-162, and the attribute-based evaluation model that business authority conditions actually require.

*Gap note:* every mature policy-as-code source addresses infrastructure and access policy. Business-authority policy — spend limits, approval conditions, escalation triggers expressed in terms a compliance officer can review — has no equivalent product category, which is the commercial observation on this page.
