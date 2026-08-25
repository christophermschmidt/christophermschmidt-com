# RAG grounding quality

**Pillar:** Semantic Readiness
**Layer:** AI Readiness & Interoperability
**Status:** Scoped
**Prerequisites:** [AI-readable schema design](AI-readable%20schema%20design.md), [Unstructured content readiness](Unstructured%20content%20readiness.md)
**Verified by:** [Evaluation/hallucination-surface reduction](Evaluation%20hallucination-surface%20reduction.md), [Adversarial context integrity](Adversarial%20context%20integrity.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → AI Readiness & Interoperability → RAG grounding quality (coverage: partial)

## Definition

The measured quality of the retrieval step: whether the passages, records or rows returned actually contain the information needed to answer, whether every claim in the answer traces to one of them, and whether the corpus itself is authoritative and current.

## Why it matters

Most "hallucination" in enterprise deployments is a retrieval failure wearing a generation costume. The model was asked a question, given passages that did not contain the answer, and did what it was built to do. Grounding quality is therefore the measurable, fixable component of the problem, and it decomposes cleanly: did we retrieve the right thing, did we retrieve enough, did the answer stay inside what we retrieved, and was the corpus worth retrieving from in the first place. Organizations reliably invest in the fourth-least-important of those.

## Failure modes

- Chunking that splits a table from its header or a clause from its condition, so the retrieved passage is locally coherent and semantically wrong.
- A corpus containing superseded policy versions with no recency or authority signal, so the retriever ranks a 2019 document above the current one.
- Retrieval over documents when the answer is a number that lives in the semantic model — the wrong retrieval modality for the question.
- Citations that point to a document rather than a span, so nobody checks them and errors survive review.
- No measurement of retrieval recall, so the team tunes generation prompts against a retrieval defect.
- Access-trimmed retrieval that silently returns fewer passages for restricted users, producing a confidently incomplete answer.

## Anti-patterns

- **Improving the prompt to fix a retrieval problem.** Common, cheap, and it moves the observable symptom without touching the cause.
- **Citation as decoration.** Links rendered under the answer that nobody verifies and that frequently do not support the sentence they follow.
- **One corpus for everything.** Policy documents, meeting notes, drafts and current contracts in a single index with no authority tiering.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Documents are indexed and retrieved. Quality is judged by whether answers look right. |
| 2 | Governed | Corpus scope and curation rules are defined; obvious stale and draft content is excluded. |
| 3 | Contextual | Retrieval is measured for recall and precision against a labeled question set, claims are cited at span level, and the corpus carries authority and recency signals the retriever uses. |
| 4 | Operational | Retrieval quality is tracked continuously in production, groundedness of answers is scored, and failures are attributed to retrieval versus generation. |
| 5 | Autonomous | The retriever tunes against observed failures, ungrounded claims are suppressed before the answer is returned, and corpus gaps are detected and reported as content work. |

## Diagnostic question

*When an answer is wrong, how do you know whether the retrieval failed or the model did?*

1. We don't distinguish; we adjust the prompt.
2. We curate the corpus and exclude obviously stale content.
3. Retrieval recall and precision are measured against a labeled set, and claims are cited at span level.
4. Both retrieval quality and groundedness are tracked in production and failures are attributed.
5. The retriever self-tunes and ungrounded claims are suppressed before returning.

## Evidence to request

- The labeled evaluation set for retrieval, and its last run.
- Corpus inventory with authority tier and recency per source.
- The chunking strategy and the handling of tables, headers and conditional clauses.
- A sample of production answers with their retrieved context, so groundedness can be checked directly.
- The split of question types between document retrieval and structured query, and how that routing is decided.

## Verification

Take ten real questions, capture what was retrieved for each, and read the retrieved context before reading the answer. Score whether the answer was derivable from what was retrieved. This separates the two failure modes in an hour and almost always shows retrieval as the dominant one — which redirects remediation budget away from model work, where customers want to spend it, toward content and indexing work, where it belongs.

## Article angle

The "your hallucination problem is a retrieval problem" argument is well-trodden; the differentiated version is the routing point — a large share of enterprise RAG questions should never have gone to document retrieval at all, because the answer is a number in a governed model. That connects this capability directly to intelligence routing in Pillar 2 and makes it part of the framework's spine rather than a standalone RAG post.

## Sources

- [Evaluating Retrieval Augmented Generation using RAGAS](https://superlinked.com/blog/evaluating-retrieval-augmented-generation-ragas) — the four-metric decomposition (context precision, context recall, faithfulness, answer relevancy) that lets a failure be attributed to retrieval or to generation rather than treated as one undifferentiated quality problem.
- [LLM-Assisted Question-Answering on Technical Documents Using Structured Data-Aware Retrieval Augmented Generation](https://arxiv.org/pdf/2506.23136) — the chunking problem stated rigorously: passages that split tables from headers are locally coherent and semantically wrong.
