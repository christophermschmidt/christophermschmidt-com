# Policy change governance

**Pillar:** Operational Readiness
**Layer:** Policy
**Status:** Scoped
**Prerequisites:** [Explicit authority grants](Explicit%20authority%20grants.md), [Agent identity and delegation](Agent%20identity%20and%20delegation.md)
**Verified by:** [Accountability trails](Accountability%20trails.md)
**Microsoft implementation:** not mapped in the reference architecture. No first-party workflow exists for reviewing, approving, and documenting a change to an agent's authority; Entra Agent ID governs identity and permission state, not the organizational decision to change it.

## Definition

The organizational process by which a change to an agent's authority, scope, or policy grant is proposed, reviewed by the people accountable for that action class, approved, documented, and communicated, distinct from the technical mechanism that encodes the resulting policy. Explicit authority grants records what the current grant is. This capability records how, and by whom, that grant is allowed to change.

## Why it matters

Organizational readiness, who owns a decision, how change gets managed, is real, and it does not need its own pillar to be checkable. Most of what makes it feel vague is that it gets discussed as culture rather than as an artifact. Scoped to policy changes specifically, it becomes exactly as checkable as anything else in the framework: is there a named reviewer, is there a record of what changed and why, did anyone outside the team that wanted the change more permissions actually look at the request. Without this capability, Explicit authority grants degrades over time even at a high maturity level: a grant that was reviewed and approved correctly on day one drifts as tools are added, thresholds are raised in response to pressure, and nobody revisits the original approval. The grant record stays accurate to what exists; it stops being accurate to what was actually decided.

## Failure modes

- An engineer widens an agent's scope to unblock a ticket, and the change ships without anyone who owns the business risk reviewing it.
- The policy documentation is updated after the fact to match what was already shipped, so the record describes the change instead of governing it.
- Reviewers are a role or a team alias, not a named person who can be asked why a specific change was approved.
- No distinction exists between a routine, low-risk change and one that expands what the agent can financially or operationally commit to, so both get the same one-click approval.
- Change history exists in a ticketing system but not in a form that can be produced for an auditor asking what authority existed on a specific date.

## Anti-patterns

- **Governance as a Slack thread.** A change gets discussed and approved informally, and the only record is a conversation nobody can retrieve eighteen months later.
- **The standing exception.** A change gets fast-tracked once for an emergency and the fast path quietly becomes the normal path, because nobody removed it after the emergency ended.
- **Reviewing the code, not the authority.** Engineering change review catches whether the implementation is correct. It does not ask whether the business should have granted this scope at all, which is a different question with a different reviewer.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Authority changes ship whenever an engineer makes them. No review, no record. |
| 2 | Governed | Changes are reviewed and approved, but informally, with no consistent record of who approved what or why. |
| 3 | Contextual | A named reviewer, distinct from the requester, approves and documents every authority change, with the reason and the date recorded. |
| 4 | Operational | Changes are classified by risk, higher-risk changes require broader sign-off, and change frequency and approval time are tracked. |
| 5 | Autonomous | The review requirement scales automatically to the risk of the specific change, and an authority change cannot take effect without a recorded, current approval. |

## Diagnostic question

*The last time your agent's authority changed, who approved it, and where is that decision recorded?*

1. Nobody specifically approved it; someone with access made the change.
2. It was approved informally, but there is no consistent record.
3. A named reviewer, distinct from the requester, approved and documented it with a reason.
4. Changes are risk-classified, higher-risk changes get broader sign-off, and this is tracked over time.
5. Review scales automatically to risk, and no change takes effect without a current, recorded approval.

## Evidence to request

- The record of the last three changes to any agent's authority or scope: who requested, who approved, when, and why.
- Whether the reviewer is ever the same person as the requester.
- The organization's definition, if one exists, of which changes count as high-risk and require broader sign-off.
- Whether authority history can be reconstructed for a specific past date, not just the current state.

## Verification

Ask for the approval record on the most recent authority change, then ask the approver directly what they understood the change to permit. A gap between what the approver believed they approved and what the system now actually allows is the finding, and it is common because the conversation and the configuration are usually separate events, the same failure pattern that shows up in Explicit authority grants but at the point of change rather than at the point of initial grant.

## Article angle

The organizational-readiness argument without the vagueness that usually sinks it: instead of asking whether a company has good AI governance culture, ask for the record of the last authority change and see whether anyone outside the requesting team looked at it. Most organizations that believe they have governed AI cannot produce this record, and the gap is not a maturity problem, it is a missing artifact. This is also the capability that keeps Explicit authority grants honest over time rather than accurate only on the day it was written.

## Sources

- [ISO/IEC 42001:2023, Artificial Intelligence Management System](https://www.iso.org/standard/42001), International Organization for Standardization. Requires documented change-management controls and accountable governance as part of an AI management system, which is the management-system basis for treating a policy change as a governed event rather than an implementation detail.
- [NIST AI Risk Management Framework, Govern function](https://www.nist.gov/itl/ai-risk-management-framework), National Institute of Standards and Technology. The Govern function is the only one of the framework's four functions that operates at the organization layer rather than the system layer, requiring defined roles, responsibilities, and accountability structures for AI risk decisions, which is the organizational-accountability requirement this capability makes checkable at the level of a single policy change.
