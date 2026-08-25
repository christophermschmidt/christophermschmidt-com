# Agent identity and delegation

**Pillar:** Operational Readiness
**Layer:** Policy
**Status:** Scoped
**Prerequisites:** none — this is a root capability of Pillar 2
**Verified by:** [Explicit authority grants](Explicit%20authority%20grants.md), [Accountability trails](Accountability%20trails.md), [RLS design](RLS%20design.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → "Ten things the platform does not do" → attributability under creator-delegated execution; and the nine-that-will-bite list, where creator-delegated execution is called out as breaking the accountability model

## Definition

Every agent is a distinct, governed identity with a lifecycle — provisioned, owned, permissioned, reviewed, and eventually retired — and every action it takes is attributable either to that identity or to the human principal it is acting for, with the delegation chain recorded.

## Why it matters

Authority cannot be granted to an actor the system cannot name. This capability is a prerequisite to the entire Policy layer and it is routinely skipped, because the fastest path to a working agent is a shared service principal with broad permissions. That choice quietly destroys three things at once: row-level security becomes unenforceable, the audit trail records the service account rather than the actor, and the accountability question after an incident has no answer. It also creates the sprawl problem — agents that nobody owns, doing work nobody reviews, holding permissions nobody granted deliberately.

## Failure modes

- Agents run as a shared service principal, so every agent's actions are indistinguishable from every other's.
- The agent acts with its creator's standing permissions, so an action is attributed to a person who was not present and did not decide.
- No owner of record, so nobody is responsible for reviewing what the agent can do.
- Permissions accumulate as capabilities are added and are never re-reviewed or reduced.
- No retirement path, so decommissioned agents keep live credentials.
- Agent-to-agent calls lose the original principal, so the chain of delegation ends at the first hop.
- Secrets and tokens held by the agent with no rotation and no scoping.

## Anti-patterns

- **Treating agents as applications.** An application's identity model assumes a stable, reviewed permission set. An agent's capability surface changes whenever someone adds a tool.
- **Attribution to the creator.** Convenient and wrong — it makes a person accountable for behavior they did not initiate and cannot observe, which is the fastest way to lose internal support for agentic deployment.
- **Governance by naming convention.** A prefix on the service principal name is not an identity lifecycle.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Agents share credentials or run as their creators. No inventory exists. |
| 2 | Governed | An agent inventory exists with a named owner per agent and a documented provisioning process. |
| 3 | Contextual | Each agent holds a distinct governed identity; actions execute under the end user's delegated authority where a user initiated them, and the delegation chain is preserved across hops. |
| 4 | Operational | Agent identities are in the access-review cycle, permissions are measured against use, orphaned and over-permissioned agents are reported, and retirement is enforced. |
| 5 | Autonomous | Provisioning, permission right-sizing and retirement are automated against observed behavior, and an unattributable action cannot execute. |

## Diagnostic question

*When your agent writes to a system of record, whose identity appears in that system's audit log?*

1. A shared service account's.
2. A per-agent service account's, and we have an inventory with owners.
3. The end user's, via delegation — and the chain survives agent-to-agent calls.
4. As above, plus agent identities are in the access-review cycle with permissions measured against use.
5. Provisioning and right-sizing are automated, and unattributable actions cannot execute.

## Evidence to request

- The agent inventory with owner, purpose, permission set and creation date.
- The authentication configuration for each agent's tools — delegated or application permissions.
- An actual audit log entry from a system of record for an agent-initiated write.
- The access review record covering agent identities.
- The retirement process and the last agent retired through it.

## Verification

Do not ask how the architecture works; look at the downstream system's log for a real agent write and read the principal. This is a two-minute test with a binary answer and it settles the score. Then count agents in the inventory against agents actually running — the difference is the sprawl finding, and in most organizations the inventory is short.

## Aviation parallel

Pilot-in-command is a named role held by a specific person for a specific flight, and every action in the cockpit is attributable to a seat. The concept exists because accountability that is diffuse is accountability that is absent — the same reason a shared service principal is not an identity model but the deliberate removal of one.

## Article angle

Underwritten relative to its importance, and the framing that makes it land is that authority without identity is not governance, it is paperwork. There is also a hard commercial hook: identity governance for agents became a real product category in 2026, which means the customer's identity team already has budget and a mandate here, and the data team has no idea. Connecting those two rooms is a consulting service in itself.

## Sources

- [Identity Management for Agentic AI: authorization, authentication and security for an AI agent world](https://arxiv.org/pdf/2510.25819) — the academic statement of the problem, including the externalised PEP/PDP pattern and why treating an agent as an application misrepresents its permission surface.
- [What is Microsoft Entra Agent ID?](https://learn.microsoft.com/en-us/entra/agent-id/what-is-microsoft-entra-agent-id) — the first-party answer to agents as first-class identities, GA since April 2026, using OAuth 2.0, MCP and A2A.
- [Governing Agent Identities](https://learn.microsoft.com/en-us/entra/id-governance/agent-id-governance-overview) — the lifecycle and on-behalf-of delegation model, and the requirement that a delegated human user always remain assigned so the agent's access stays current.
