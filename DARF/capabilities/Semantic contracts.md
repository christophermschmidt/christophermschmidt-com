# Semantic contracts

**Pillar:** Semantic Readiness
**Layer:** AI Readiness & Interoperability
**Status:** Scoped
**Prerequisites:** [AI-readable schema design](AI-readable%20schema%20design.md), [Canonical metric definitions](Canonical%20metric%20definitions.md)
**Verified by:** [Change safety and versioning](Change%20safety%20and%20versioning.md), [Semantic parity across surfaces](Semantic%20parity%20across%20surfaces.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → AI Readiness & Interoperability → Semantic contracts (coverage: pattern)

## Definition

A machine-readable, versioned agreement between a producer of semantic assets and their consumers, stating what is guaranteed: which objects exist, what they mean, their grain and units, their freshness contract, their stability commitment, and the process by which any of it changes.

## Why it matters

Agents are the least forgiving consumer a semantic layer has ever had, and the most numerous. A dashboard consumer notices a renamed column and adapts; an agent produces a wrong or failed answer with no signal that a contract was broken. The contract is also what makes the semantic layer a product rather than an artifact — it establishes who is accountable when meaning changes, which is the question every failure investigation eventually reaches and most organizations cannot answer.

## Failure modes

- Consumers are unknown, so producers cannot assess the impact of a change and change anyway.
- Meaning changes without a schema change — the filter inside a measure is adjusted and everything downstream silently shifts.
- Contracts cover structure only, so types and columns are guaranteed while semantics are not.
- No stability tiering, so an experimental model and a certified one carry the same implied promise.
- The contract exists as documentation rather than as an artifact anything validates against.
- Freshness, grain and units are outside the contract even though every consumer depends on them.

## Anti-patterns

- **Data contracts as schema validation.** Type and nullability checks are the easy half; nothing in them catches a redefinition of what the number means.
- **Contract without a consumer registry.** A promise made to nobody in particular cannot be broken in a detectable way.
- **Versioning the file, not the meaning.** Git history on the model definition records that something changed, not that a guarantee was withdrawn.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | No contract. Producers change what they need to; consumers cope. |
| 2 | Governed | Expectations are documented and a change-notification convention exists. |
| 3 | Contextual | Contracts are machine-readable artifacts covering structure and semantics — grain, units, freshness, definition — validated in CI, with a registered consumer list per asset. |
| 4 | Operational | Contract violations are detected before release and reported; stability tiers are declared per asset and breach rates measured per tier. |
| 5 | Autonomous | A change that breaks a contract cannot merge; affected consumers are notified with the specific impact, and deprecation windows are enforced by the platform. |

## Diagnostic question

*What is guaranteed to a consumer of your semantic layer, in a form a machine can check, and who is registered as depending on it?*

1. Nothing formal; consumers adapt to what we ship.
2. Expectations are documented and we try to notify people.
3. Machine-readable contracts cover structure and semantics, validated in CI, with a registered consumer list.
4. Violations are caught pre-release, stability tiers are declared, and breach rates are measured.
5. Breaking changes cannot merge and deprecation windows are platform-enforced.

## Evidence to request

- An actual contract artifact for one semantic asset.
- The consumer registry — who depends on that asset, including agents and external applications.
- The CI job that validates a change against the contract, and a run where it failed.
- The stability tier definitions and which assets sit in each.

## Verification

Ask for the list of consumers of the customer's most-used semantic model. If the answer is a workspace permission list rather than a registry of dependent systems, the contract is at level 2 at best. Then ask what happened the last time a measure's definition changed — who was told, how, and how long before. The story is usually more informative than the artifact.

## Article angle

Data contracts have been discussed for years mostly in the pipeline context. The unwritten piece is the semantic contract: the guarantee is not about columns and types, it is about meaning, and meaning is the thing agents consume. Pairs with change safety as a two-part argument — the contract states the promise, change safety is the mechanism that keeps it.

## Sources

- [The Shift Left Data Manifesto](https://dataproducts.substack.com/p/the-shift-left-data-manifesto) — Chad Sanderson's argument for moving the contract to the producer boundary, which is the origin of most current data-contract practice.
- [Why you'll need data contracts](https://roundup.getdbt.com/p/ep-34-why-youll-need-data-contracts) — the producer/consumer framing and the point this capability extends: structural contracts are the easy half, and semantic guarantees are what agents actually consume.
