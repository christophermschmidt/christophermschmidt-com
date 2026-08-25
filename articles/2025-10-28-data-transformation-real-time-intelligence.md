---
title: "Data transformation in Real Time Intelligence"
date: 2025-10-28
slug: data-transformation-real-time-intelligence
category: architecture-strategy
tags: [real-time-intelligence, eventstream, eventhouse, kql, transformation, fabric, roches-maxim]
url: https://christophermschmidt.com/articles/2025-10-28-data-transformation-real-time-intelligence
status: published
---

# Data transformation in Real Time Intelligence

Organizations increasingly rely on real time intelligence to gain immediate insights and respond proactively to events as they unfold. The ability to transform data instantly is central to these capabilities, enabling systems to ingest, process, and analyze information in motion rather than waiting for batch intervals.

Choosing the right technology has dramatic impact on the performance and cost of both ingestion AND consumption. Within Real Time Intelligence in Microsoft Fabric, there is a rich set of powerful data transformation capabilities ranging from light, low-overhead tweaking to powerful model and code-based transformations. How do you know when to transform data in each tool? Read on.

## ELT vs. Streaming: Understanding sets vs. payloads

One of the most significant differences between traditional ELT pipelines and streaming data processing lies in the granularity of transformation. ELT pipelines are designed for **set-based operations** — they typically ingest batches of data and process them collectively. This allows for complex transformations, aggregations, and joins across entire datasets, but at the cost of latency.

Back when I used to teach SQL Server Integration Services classes, I used to teach people to stop thinking of data as rows and to think of the entire set of data you want to move. If I had a stack of 10,000 post-it notes, with another post-it added every few minutes throughout the day, it was far more efficient to wait and pick up the entire stack and move it across the room rather than move them one by one. However, as data sizes have increased this has become harder to manage. It is one thing to move a few thousand rows across an on-prem network every day; it is an entirely different subject when you are moving multi-million row sets across cloud environments incurring ingress/egress charges.

In contrast, **streaming workloads process data by payload** — transforming each event as it arrives. This enables near-instantaneous insights and actions but requires a different mindset regarding transformation logic. This is much closer to classic application-level design, where individual operations are processed. Using the post-it notes example, instead of waiting to pick up the entire stack, each post-it is moved as a new one becomes available. This allows much more rapid response, keeps network traffic to a minimum, and integrates data into the fabric of the business.

**The choice between set-based and event-based processing is driven by the requirements for latency and data actionability.**

## Real Time Intelligence: The Right Tool for the Right Job

Now that we've established why, let's understand what tools are available within Fabric's Real Time Intelligence to process these rows of data. Before diving too deep, it's important to remind everyone of **Roche's Maxim:**

> *"Process data as far upstream as possible, and as far downstream as necessary."*

This principle doesn't change when processing event-driven data. I might even argue that it is MORE relevant in event-driven architectures, because data can be transformed almost instantaneously after generation.

Remember that event processing is not like traditional ETL tools. You are operating on a particular payload, which may contain one or multiple rows. One of the benefits of Real Time Intelligence is that it contains both a **stream processor** (via the Eventstream engine) and a **state store** (via Eventhouse). Eventhouse can also serve as a very sophisticated transformation engine.

**Eventstream transformation capabilities** include normalizing field formats, performing lightweight enrichment (such as geocoding based on a location field) or filtering out irrelevant records, SQL transformations, time series windows (hopping, sliding, session, snapshot, tumbling), content-based routing, and schema registration and data contracts.

**Complementary strengths:**

- Eventstream's sweet spot: time window analytics over a few seconds to minutes
- Eventhouse's sweet spot: anything from a few minutes to days or months

Eventstream excels at immediate transformations over events ingested during a reasonably recent time window. Eventhouse excels at super-quick insights over a much longer time period, well beyond the confines of a single event payload.

## Choosing the Right Transformation Approach

Selecting the optimal transformation strategy depends on several factors.

**Data context.** Context can be applied in many places in Eventstream. Use Roche's Maxim to help you decide what works best for your scenario.

**Complexity of logic.** Simple normalization and enrichment tasks fit well within Eventstream. More advanced analytics or correlations may necessitate Eventhouse and KQL integration.

**Scalability and maintenance.** Streaming transformations are generally easier to scale horizontally but may require careful state management. Eventhouse transformations can be more resource-intensive and complex to maintain, especially as reference datasets grow.

**Integration and ecosystem.** Consider the broader data architecture — how Eventstream and Eventhouse fit into downstream analytics, reporting, and machine learning workflows. Will other users in your organization need to access the stream directly? Will they access via Eventhouse? Via the main database or follower databases?

**Personal preference.** Sometimes it's just personal preference — you can write the same transformation in either Eventstream or Eventhouse. Would you prefer to use SQL or KQL?

**Cost considerations.** How many CUs within Fabric are consumed based on the type of transformation? There is a tradeoff, but as your data volumes scale you want to ensure that your solution is as efficient as possible.

**Schema flexibility.** If your inputs have a relatively static schema with few changes and you want schema-on-write enforcement, breaking that schema out during ingestion using content-based routing, array expansion, and similar operations makes it easy. If your schema has a lot of variability and changes frequently, leveraging Kusto capabilities such as `DropMappedFields` allows you to code defensively from the beginning.

## Closing

The power of Real Time Intelligence lies in choosing the right tool for the right transformation at the right time. Whether you're performing lightweight field normalization in Eventstream or complex historical correlation in Eventhouse, understanding the strengths of each approach ensures optimal performance, cost efficiency, and maintainability.

Remember Roche's Maxim: process data as close to the source as makes sense for your use case, but don't hesitate to leverage downstream capabilities when the context or complexity demands it.
