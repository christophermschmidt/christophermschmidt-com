# RLS design

**Pillar:** Semantic Readiness
**Layer:** Context Stability
**Status:** Scoped
**Prerequisites:** [Entity resolution](Entity%20resolution.md), [Grain consistency](Grain%20consistency.md)
**Verified by:** [Semantic parity across surfaces](Semantic%20parity%20across%20surfaces.md), [Agent identity and delegation](Agent%20identity%20and%20delegation.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Context Stability → RLS design (coverage: partial — four documented traps, each of which silently widens access)

## Definition

Row-, column- and object-level access rules that produce the same restriction for the same principal regardless of which engine, surface or agent executes the query. Design covers not just the rules but the identity they are evaluated against and the paths that can bypass them.

## Why it matters

Under dashboards, an RLS gap leaked data to a person who mostly did not notice and rarely acted on it. Under agents, an RLS gap leaks data into a generated summary, a downstream action, and a conversation log — and the leak is invisible because the agent presents a complete-looking answer with no indication that it saw more than the asker should. The bypass paths matter more than the rules: almost every real failure is a query path that never evaluated the rule, not a rule that was written wrong.

## Failure modes

- An agent or connector authenticating as a service principal, so every user's query runs with the service principal's full access.
- A query path that reads files or tables directly rather than through the layer where the rule is defined.
- Workspace-level administrative roles bypassing data-level rules entirely.
- Row-level and column-level rules defined in different places, producing an error or, worse, a silent widening.
- Rules keyed to an identity attribute that entity resolution has not made reliable, so the same person maps to different scopes on different days.
- A caching or import layer materializing the unfiltered result once and serving it to everyone.

## Anti-patterns

- **Testing RLS by impersonation in one tool.** Proves the rule works on that path only. The agent is a different path.
- **Security by report design.** Restricting what a report shows rather than what the model returns; the model is what the agent queries.
- **Service-principal convenience.** Any architecture where the agent's own identity, rather than the user's, reaches the data layer has no RLS regardless of how the rules are written.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Access is controlled at the report or workspace level. Row-level rules are absent or partial. |
| 2 | Governed | Rules are defined and documented with an owner, and tested by impersonation on the primary surface. |
| 3 | Contextual | Rules are authored once at the data layer and enforced across every engine and surface; agent queries execute under the end user's identity, not a service identity. |
| 4 | Operational | Every access path is inventoried and tested against a principal matrix on a schedule; bypass paths are known, counted and closed on a plan. |
| 5 | Autonomous | A new query path cannot reach data without passing the rule evaluation, and an unenforced path is detected and blocked automatically. |

## Diagnostic question

*Under whose identity does the agent's query execute, and which paths to the data do not evaluate your row-level rules?*

1. Access is at report or workspace level; there are no row-level rules.
2. Rules exist and are tested by impersonation on the main surface.
3. Rules are authored once and enforced across engines; agents run under the end user's identity.
4. All paths are inventoried and tested against a principal matrix; bypasses are tracked and being closed.
5. An unenforced path cannot reach data and is blocked automatically.

## Evidence to request

- The complete list of query paths to the data, including agent tools, connectors, notebooks, APIs and direct file access.
- Authentication mode for each path — delegated user identity or service principal.
- The rule definitions and where they are authored.
- The principal test matrix and its last run.
- The list of principals holding workspace-level roles that bypass data rules.

## Verification

Ask the agent, authenticated as a restricted user, a question whose correct answer differs from the unrestricted one, and compare against the same question asked directly. Then walk the path inventory and check the authentication mode of each one yourself. Any service-principal path to agent-facing data caps this capability at 2 and should be written into the gap register as a security finding, not a modeling finding.

## Article angle

The under-discussed half of RLS is that agentic architectures create new query paths faster than governance closes them, and each new tool is a new chance to bypass. Best told through the specific, checkable claim that most enterprise agent deployments in 2026 are running at least one service-principal path against user-scoped data — a claim readers can test in an afternoon.

## Sources

- [Integrate Direct Lake security](https://learn.microsoft.com/fabric/fundamentals/direct-lake-security-integration#object-level-security-ols-and-row-level-security-rls) — first-party documentation of the trap that matters most: model-level rules do not extend beyond the model, so a user with OneLake access can retrieve data the semantic model restricts.
- [OneLake security for SQL analytics endpoints — delegated mode](https://learn.microsoft.com/fabric/onelake/security/sql-analytics-endpoint-onelake-security#delegated-mode-in-onelake-security) — the service-identity problem stated by the vendor: in delegated mode, data access is performed using the item owner's identity, not the signed-in user's.
- [Spark support for OneLake security](https://learn.microsoft.com/fabric/data-engineering/spark-onelake-security#how-spark-enforces-onelake-security) — confirms workspace Admin, Member and Contributor roles are not restricted by RLS or CLS, which is the bypass path most estates never inventory.
