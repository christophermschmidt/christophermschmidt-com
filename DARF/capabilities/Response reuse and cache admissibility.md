# Response reuse and cache admissibility

**Pillar:** Operational Readiness
**Layer:** Execution
**Status:** Scoped
**Prerequisites:** [RLS design](RLS%20design.md), [Live vs snapshot data](Live%20vs%20snapshot%20data.md), [Change safety and versioning](Change%20safety%20and%20versioning.md)
**Verified by:** [Cost per decision](Cost%20per%20decision.md), [Semantic parity across surfaces](Semantic%20parity%20across%20surfaces.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Execution → partial. Prompt caching is automatic on supported models and Fabric bills cached input at a tenth of the uncached rate. Semantic caching is a productized API Management policy pair. Neither decides what is *admissible* to reuse, and no product carries the cache key.

## Definition

The explicit decision, per class of question, about whether a previously produced answer may be served to a later request instead of being recomputed. Where reuse is permitted, this capability also owns what the cache key has to carry for it to stay correct.

## Why it matters

Reuse is the largest cost lever in a consumer-facing agent and the fastest way to serve the wrong person the right answer. Both halves are true at once, which is why this belongs in Execution beside intelligence routing rather than in a cost appendix.

The economics are not marginal. A curated suggested prompt is a question the platform team wrote down before any user clicked it, so the answer is knowable in advance and the marginal cost of the hundredth reader should be a table read. In practice each click re-runs the whole request, and the user's question is a rounding error inside the payload: the agent instructions, the data source instructions and the example queries dominate the input tokens and are byte-identical across every user.

The correctness half is where programs get hurt. An answer is only shareable if it does not depend on who asked, and that is a property of the row-level security model rather than of the question. A cache keyed on question text alone will serve the first requester's permission scope to everyone who follows, and if the first requester was over-privileged, the cache has quietly become an exfiltration path that leaves no trace in any audit log. The same key, missing a definition version, keeps serving numbers computed under a measure definition that has since changed. Both failures are silent and both look like correct answers.

The deeper point is that "cache it" is usually the wrong frame. A question with a known handler and a closed period should be **precomputed**, not cached, and the routing decision that recognizes it is the capability upstream of this one. Caching is what you do with the questions you could not anticipate.

## Failure modes

- No cacheability classification at all, so every question is either recomputed forever or cached uniformly, and both are wrong for most of the traffic.
- Cache key omits the requester's effective security scope, so one user's permissions become everyone's answer.
- Cache key omits the semantic definition version, so a measure change silently invalidates stored answers that continue to look correct.
- Cache key omits the data as-of watermark, so a refresh does not invalidate anything and last period's number is served with this period's confidence.
- Time-to-live chosen as a round number rather than derived from the refresh cadence of the underlying tables.
- Semantic similarity thresholds tuned for hit rate, so questions that differ in a single decisive token are answered from each other.
- Reuse applied to an action path, where a stale approval or a replayed effect is a different class of harm from a stale read.
- Cached answers served without the as-of stamp and citations the original carried, so the consumer cannot tell the answer is a reuse.
- Prompt prefixes assembled non-deterministically, defeating provider-level caching without anyone noticing, because the only symptom is a bill.

## Anti-patterns

- **Semantic caching as the first move.** It is the most productized option and the least safe, because it answers a question that was never asked with an answer to a question that resembles it. Reach for precomputation and exact-match reuse first, and treat similarity matching as the residual case.
- **Caching numeric answers by similarity.** "Last month" and "this month" are close in embedding space and opposite in meaning. Similarity matching suits document and policy retrieval far better than governed aggregates.
- **Keying on user identity.** Correct and useless: it removes the leak by removing the sharing, so the cost problem is untouched. The right key is the *equivalence class* of what the requester can see, which is a modeling job.
- **Treating a cache hit rate as the metric.** The metric is cost per decision at unchanged answer quality. A high hit rate with drifting answers is a regression that reports as a win.
- **Assuming the platform's cache is your cache.** Provider prompt caching is prefix-based, evicted on an interval you do not control, and scoped in ways that may not span your subscriptions. It reduces the cost of recomputing. It does not constitute reuse of the decision.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Every request is recomputed. Nobody has asked whether any answer is reusable, and prompt prefixes vary run to run. |
| 2 | Governed | Reuse exists somewhere, usually a time-to-live set by hand, and the rule is documented rather than enforced. Stable prefixes are a convention. |
| 3 | Contextual | Each question class carries a cacheability class. The key includes security scope, definition version and data watermark, and the system refuses to serve a hit when any component is stale or absent. |
| 4 | Operational | Hit rate, cost per decision and answer divergence are measured per question class, and a parity test compares cached against freshly computed answers on a schedule. |
| 5 | Autonomous | Cacheability and time-to-live are derived from observed refresh behavior and outcome data, and a class is demoted automatically when divergence exceeds its stated bound. |

## Diagnostic question

*Two people ask your agent the same question one minute apart. What decides whether the second one gets a freshly computed answer, and if they get a stored one, what in the key guarantees they were entitled to it?*

1. Everything is recomputed, or everything is cached, and nobody chose.
2. A time-to-live is set somewhere by hand and documented.
3. Cacheability is classified per question class, and the key carries security scope, definition version and data watermark.
4. Hit rate, cost and answer divergence are measured per class, with a scheduled parity test.
5. Classes and time-to-live self-tune from refresh behavior and outcomes, and demote on divergence.

## Evidence to request

- The cacheability classification, or its absence: question classes marked shareable, partitioned, or never reusable.
- The literal cache key construction, read as code rather than described.
- The list of suggested or curated prompts, which is the set of questions the organization already knows it will be asked.
- Time-to-live values per class, and the refresh cadence of the tables each one reads, so the two can be compared.
- Similarity thresholds where semantic matching is in use, and the last time anyone reviewed what they admit.
- Whether cached responses carry the as-of stamp and citations of the original.
- Cost per decision before and after reuse, and answer divergence over the same period.

## Verification

Take the agent's published suggested prompts, which are the questions the organization has already committed to answering. For each one, ask two questions: does the answer change depending on who is asking, and does it change between data refreshes. That produces a two-by-two, and the quadrant with no identity dependence and a closed period should not be reaching a language model at all. Then read the cache key as implemented and check it against that classification.

The finding that lands hardest is the leak test. Have a broadly permissioned user ask a restricted question, then have a narrowly permissioned user ask the same question, and see which answer comes back. Where the second user receives the first user's answer, the cache is a data boundary violation that no audit log records, and the remediation is a key change rather than a policy change.

## Article angle

The counterintuitive framing is that the caching conversation is really a routing conversation wearing a cost costume. A suggested prompt is a declared question, and a declared question with a governed measure behind it and a closed period in front of it has a deterministic handler. Caching it is the second-best answer; precomputing it is the first. The industry discusses cache hit rates because that is the number the caching products expose, which is the same dynamic that makes model-tier the routing conversation everybody has.

The security half is the sharper story and nobody is telling it. Retrieval-time permission trimming has become table stakes and gets discussed. A cache sitting in front of that trimming, keyed on the text of the question, undoes it completely and does so invisibly, because the audit trail records a cache hit rather than a data access. That is a governance failure that looks like a performance optimization on every diagram it appears on.

## Sources

- [Enable semantic caching for LLM APIs in Azure API Management](https://learn.microsoft.com/azure/api-management/azure-openai-enable-semantic-caching) — the productized mechanism, and the source of the `vary-by` partition key that is the only thing standing between a shared cache and a permissions leak. Note the RediSearch module can only be enabled when the cache is created, which makes this a provisioning decision rather than a configuration one.
- [Get cached responses of large language model API requests](https://learn.microsoft.com/azure/api-management/llm-semantic-cache-lookup-policy) — carries Microsoft's own warning, verbatim: because semantic caching returns responses based on similarity rather than exact match, "it can surface responses that are incorrect, outdated, or unsafe for the current request."
- [Prompt caching](https://learn.microsoft.com/azure/foundry/openai/how-to/prompt-caching) — the mechanics that reward a stable prefix: a 1,024-token minimum, the first 1,024 tokens must be byte-identical, and caches clear within 5 to 10 minutes of inactivity and always within an hour. Evidence for why provider caching helps bursts and not a trickle.
- [Data agent in Fabric consumption](https://learn.microsoft.com/fabric/fundamentals/data-agent-consumption) — the rate card that quantifies the lever: 100 CU-seconds per 1,000 input tokens against 10 for cached input, a tenfold difference, with output at 400. Also states directly that the user's question is only a portion of input tokens, because agent instructions, data source instructions and example queries are counted on every call.
- [Use Azure API Management in a multitenant solution](https://learn.microsoft.com/azure/architecture/guide/multitenant/service/api-management) — Microsoft's own instruction to include the tenant identifier in the cache key, and the warning about being "manipulated into referring to another tenant's value," which is the adversarial framing of the same defect.
