# Unstructured content readiness

**Pillar:** Semantic Readiness
**Layer:** AI Readiness & Interoperability
**Status:** Scoped
**Prerequisites:** [Naming conventions](Naming%20conventions.md), [Entity resolution](Entity%20resolution.md)
**Verified by:** [RAG grounding quality](RAG%20grounding%20quality.md), [Adversarial context integrity](Adversarial%20context%20integrity.md), [Minimum sufficient context](Minimum%20sufficient%20context.md)
**Microsoft implementation:** not mapped in the reference architecture, which scoped only the structured estate. Microsoft Purview Data Security Posture Management for AI, SharePoint Advanced Management and sensitivity labels are the first-party primitives; authority tiering, deduplication and content-to-entity binding are a build.

## Definition

The state of the document estate an AI system will read — SharePoint sites, file shares, wikis, contract repositories, policy libraries, ticket bodies, PDFs — assessed as a governed corpus rather than as storage. Readiness covers inventory, ownership, authority tiering, deduplication, lifecycle, permission hygiene, and whether a document can be connected to the business entities it concerns.

## Why it matters

Most enterprise decision context is unstructured, and the entire rest of Pillar 1 is about the structured minority. That asymmetry is the single largest scope gap in most readiness assessments. The structured estate has had thirty years of modeling discipline applied to it; the document estate has had none, and it is now the primary retrieval surface for every Copilot, agent and assistant in the organization.

Two consequences make this a readiness capability rather than an IT hygiene one. First, permission drift that was harmless when nobody could find a document becomes an exposure the moment a semantic search engine can. Second, the corpus contains superseded versions of exactly the documents that matter most — the old expense policy, the prior SOP, the contract that was renegotiated — and a retriever with no authority signal ranks them on similarity, not currency. A confidently wrong answer sourced from a real internal document is the hardest failure to detect and the easiest to act on.

## Failure modes

- No inventory: nobody can state how many documents are in the agent's reachable corpus or which sites they come from.
- Permission inheritance and broad sharing links mean the corpus is effectively wider than any individual's intended access, and semantic search surfaces what navigation never did.
- Superseded policy and procedure versions live alongside current ones with no authority or effective-date signal.
- Near-duplicate documents — the same SOP forked across four departments — with no canonical designation.
- No owner of record per content set, so nobody is accountable for currency or removal.
- No retention or lifecycle, so the corpus only grows and the ratio of current to stale worsens monotonically.
- Documents cannot be joined to the entities they concern, so a question about a specific supplier cannot retrieve that supplier's contract except by name match.
- Scanned and image-only documents indexed by filename alone.

## Anti-patterns

- **Indexing the whole tenant and tuning the retriever.** Treats an authority problem as a relevance problem. No amount of reranking distinguishes the current policy from the 2019 one if neither carries a date the retriever reads.
- **Sensitivity labeling as content governance.** Labels control exposure. They say nothing about whether the document is current, canonical or correct.
- **Deferring cleanup until after the pilot.** The pilot's results are what determine whether there is a program, and they will be produced on the uncleaned corpus.
- **Treating this as a records-management project.** Records management optimizes for retention compliance; AI readiness optimizes for retrieval precision. They overlap and are not the same work.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Content lives wherever teams put it. Scope, ownership and currency are unknown. |
| 2 | Governed | The reachable corpus is inventoried, sensitive content is labeled, high-risk oversharing has been assessed, and content sets have named owners. |
| 3 | Contextual | Content carries authority tier, effective date and owner as metadata the retriever uses; superseded versions are excluded from the agent-visible corpus by construction; documents are bound to the business entities they concern. |
| 4 | Operational | Corpus composition is measured — currency, duplication, unowned share, unreachable-but-indexed share — and reported against targets; permission posture is monitored continuously rather than assessed once. |
| 5 | Autonomous | Stale and superseded content is detected and demoted or removed without a manual pass, and new content cannot enter the agent-visible corpus without an owner, an authority tier and an effective date. |

## Diagnostic question

*How many documents can your agent retrieve from, who owns them, and what stops it citing a policy that was superseded two years ago?*

1. We don't know the count, and nothing stops it.
2. We've inventoried the corpus, labeled sensitive content and assigned owners.
3. Authority tier, effective date and owner are metadata the retriever uses; superseded content is excluded and documents are bound to entities.
4. Corpus currency, duplication and permission posture are measured continuously against targets.
5. Stale content is demoted automatically and unowned content cannot enter the corpus.

## Evidence to request

- The corpus inventory: sites, libraries and stores in the agent's reach, with document counts.
- The oversharing or data-risk assessment output, and what was remediated as a result.
- The metadata schema for documents — specifically whether effective date, authority tier and owner exist as fields the retrieval layer reads.
- Duplication analysis across the policy and procedure sets.
- The retention and review cycle, and evidence of the last completed review.
- How a document is associated with a customer, supplier, product or case.

## Verification

Ask the agent a question whose correct answer changed at a known date — a policy threshold, an approval limit, a rate — and read which document it cites. Then search the corpus yourself for the superseded version and confirm whether it is still indexed. This takes ten minutes and it is the most persuasive demonstration available that the problem is the corpus rather than the model. Separately, ask for the count of documents in the agent's reach; an inability to produce a number caps the capability at 1.

## Article angle

The scope-gap piece, and it corrects a real imbalance in how the whole readiness conversation is framed. Every semantic-layer and ontology argument in 2026 is about the structured estate, while the majority of the context an agent actually consumes is documents nobody has governed. The sharpest formulation: your semantic model has an owner, a version, a test suite and a review cycle, and the SOP the agent will actually cite has none of the four. Pairs naturally with conversational context as a two-part treatment of the unstructured half of readiness.

## Sources

- [Configure a secure and governed foundation for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/configure-secure-governed-data-foundation-microsoft-365-copilot) — the first-party prerequisite checklist, and the clearest statement that content governance is a precondition for deployment rather than a follow-up.
- [Mitigate Oversharing to Govern Microsoft 365 Copilot and Agents](https://techcommunity.microsoft.com/blog/microsoft365copilotblog/mitigate-oversharing-to-govern-microsoft-365-copilot-and-agents/4448744) — the oversharing blueprint and the staged remediation sequence: high-risk sites first, then link exposure, then labels, then ownership, then expand in waves.
- [Microsoft moves to stop M365 Copilot from 'oversharing' data](https://www.computerworld.com/article/3616459/microsoft-moves-to-stop-m365-copilot-from-oversharing-data.html) — independent coverage confirming that oversharing was material enough to drive product change, which is useful when a customer treats it as a theoretical risk.
