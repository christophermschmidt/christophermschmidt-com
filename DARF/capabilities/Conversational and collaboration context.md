# Conversational and collaboration context

**Pillar:** Semantic Readiness
**Layer:** AI Readiness & Interoperability
**Status:** Scoped
**Prerequisites:** [Unstructured content readiness](Unstructured%20content%20readiness.md)
**Verified by:** [Adversarial context integrity](Adversarial%20context%20integrity.md), [RLS design](RLS%20design.md), [Decision logging](Decision%20logging.md)
**Microsoft implementation:** partially addressed. Microsoft Purview and the Copilot Control System govern exposure and retention across Teams and Exchange; nothing in the stack distinguishes a decision from a discussion, or attaches authority to a message.

## Definition

The governed treatment of message-based content — Teams chats and channels, Outlook mail, meeting transcripts, comment threads — as a retrieval and grounding source: what is in scope, whose it is, what trust it carries, and how a conclusion recorded in a conversation is distinguished from an opinion expressed in one.

## Why it matters

Conversation is where most enterprise decisions are actually recorded, and it is the worst-governed corpus in the organization. The reason it deserves separate treatment from documents is that four of its properties are inverted relative to a document store. It is not authored as reference material, so it carries no version, owner or currency signal and never will. It is written with an assumed audience, so it omits context that a retriever cannot recover and includes candour that a wider audience changes the meaning of. It is the corpus with the highest concentration of externally authored text — every forwarded supplier email, every customer thread — which makes it the primary indirect-injection surface. And it contains speculation, disagreement, superseded positions and jokes in the same channel as the decision, with no marker separating them.

The practical failure is specific and common: an agent asked what was decided about something returns a confident synthesis assembled from a discussion in which three people disagreed and a fourth resolved it in a meeting that was never written up.

## Failure modes

- Chat and mail indexed into the same corpus as governed policy documents, with the same implied authority.
- No discrimination between a decision, a proposal and an aside, so the agent's summary flattens all three into consensus.
- Conclusions reached in meetings and never written anywhere the corpus can see, so the retrievable record ends at the disagreement.
- Externally originated content — forwarded mail, attachments, customer replies — treated with internal trust because it sits in an internal store.
- Private channels and one-to-one chats within scope for an agent whose output is seen more widely than the original message ever was.
- Meeting transcripts indexed verbatim, so speculation said aloud becomes retrievable text with the same weight as the outcome.
- Retention configured for legal defensibility rather than retrieval quality, so a decade of superseded discussion is in scope.
- Personal and non-business content in the corpus with no exclusion mechanism.

## Anti-patterns

- **Turning on everything because the connector exists.** The default scope of a collaboration connector is the tenant, and the default scope of a decision-support agent should be a great deal narrower.
- **Treating recency as authority.** The most recent message in a thread is frequently the least considered one.
- **Summarisation as governance.** Producing a clean summary of a messy thread hides the mess rather than resolving it, and the summary then enters the corpus carrying more apparent authority than its sources.
- **Relying on existing message-retention policy.** It was written for eDiscovery. It optimizes for keeping things, which is the opposite of what retrieval precision needs.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Collaboration content is in scope by default, wholesale, with no distinction from governed content. |
| 2 | Governed | Scope is deliberately bounded — which channels, which mailboxes, what age — exposure is assessed, and sensitive content is labeled. |
| 3 | Contextual | Conversational content carries a distinct provenance and trust level that the retriever and the answer surface both act on; externally originated content is separated; decisions of record are captured somewhere other than the thread that produced them. |
| 4 | Operational | Corpus composition and its contribution to answers are measured, injection attempts through message content are detected, and the share of answers grounded in conversation rather than governed sources is tracked. |
| 5 | Autonomous | Conversational grounding is constrained automatically by decision consequence — high-consequence decisions cannot be grounded in chat — and low-trust content is excluded from action paths without a human configuring it. |

## Diagnostic question

*If someone asks the agent what was decided about a pricing change, can it distinguish the decision from the argument that preceded it — and whose messages is it reading?*

1. It summarises whatever it retrieves from chat and mail; scope is essentially the tenant.
2. Scope is deliberately bounded and exposure has been assessed.
3. Conversational content carries a distinct trust level the retriever acts on, external content is separated, and decisions of record live outside the thread.
4. Contribution to answers is measured and injection attempts through messages are detected.
5. High-consequence decisions cannot be grounded in conversational sources at all.

## Evidence to request

- The scope configuration for collaboration connectors: which channels, mailboxes and transcript sources, and the age cutoff.
- Whether the answer surface indicates when a claim came from a chat message rather than a governed document.
- The classification of content by origin — internally authored versus externally received.
- Where decisions of record are captured, if anywhere.
- Injection testing performed against the message corpus specifically.

## Verification

Ask the agent about something the organization debated and then settled. Read the citations. If they are all thread messages and none is a decision record, the organization has no decision-of-record practice and the agent is reconstructing outcomes from arguments — which caps this capability at 2 and is worth stating as a finding in its own right, because it is a governance gap that predates the agent. Then check whether any cited message originated outside the organization.

## Article angle

The uncomfortable piece, and the one closest to the reader's daily experience. Everyone has watched an assistant confidently summarize a Teams thread into a conclusion nobody reached. The argument that elevates it beyond an anecdote: conversation is simultaneously where decisions are recorded and the least governed content the enterprise holds, and connecting an agent to it does not surface institutional knowledge so much as surface institutional ambiguity at speed. It also lands the strongest practical recommendation in the unstructured group — decisions of record need a home that is not the thread that produced them.

## Sources

- [Copilot Control System security and governance](https://learn.microsoft.com/en-us/microsoft-365/copilot/copilot-control-system/security-governance) — the first-party controls for scoping, monitoring and retaining agent interaction with collaboration content, and the boundary of what the platform governs.
- [Security and governance innovations for Microsoft 365 Copilot and agents](https://techcommunity.microsoft.com/blog/microsoft365copilotblog/security-and-governance-innovations-for-microsoft-365-copilot-and-agents/4476172) — the current posture-management and data-risk-assessment capabilities, useful for establishing what a level-2 answer looks like concretely.
- [OWASP Top 10 for Agentic Applications (2026)](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) — memory poisoning and inter-agent communication as ranked risks, both of which the message corpus is the most natural vector for.
