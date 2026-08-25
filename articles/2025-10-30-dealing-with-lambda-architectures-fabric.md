---
title: "Dealing with Lambda Architectures in Microsoft Fabric"
date: 2025-10-30
slug: dealing-with-lambda-architectures-fabric
category: architecture-strategy
tags: [lambda-architecture, fabric, real-time-intelligence, action-systems, onelake, architecture]
url: https://christophermschmidt.com/articles/2025-10-30-dealing-with-lambda-architectures-fabric
status: published
---

# Dealing with Lambda Architectures in Microsoft Fabric

## Introduction to Lambda Architecture

For anyone unfamiliar, Lambda Architecture is a data processing design pattern that helps organizations manage large volumes of data by combining real-time and batch processing methods. It separates data flows into a "hot path" for instant processing and immediate insights, and a "cold path" for storing data and running deeper historical analysis.

This design emerged as a solution to balance latency and accuracy. The speed layer provided near real-time insights, while the batch layer ensured correctness by recomputing from the full dataset.

## The Problem with Traditional Lambda

Here's where things got messy in practice.

Lambda Architecture was really hard to implement. Most data simply got sent to the "batch layer" because, honestly, why send it to two places when you can send it to one and just process batch faster? Since organizations historically delivered insights through reports and dashboards, they prioritized accelerating the batch layer to reduce delays. This meant investing heavily in ETL pipelines and distributed batch systems like Hadoop or Spark.

When data truly needed to be available "in the moment," these scenarios typically happened completely outside of the data team. Entirely separate systems and processes were built to make this data available on the hot path as needed. This could range from sending data to an Event Hub or Message Queue, to pulling directly from operational systems.

Even in these scenarios, the stream got processed multiple times: once for the singular unique use case of its application and then again for batch processing into the remainder of the architecture. This created a downstream problem with data governance and data quality initiatives, since the same data now lived in many different places with no single source of truth.

## Rethinking Lambda with Fabric

This is where Fabric gives us an advantage.

On the Customer Advisory Team, we have a common question: how do we know which engine to use? There are so many choices in a SaaS solution that it can be hard to decipher the correct one for your use case. Instead of thinking about it as either/or, why not use both? This is where we can really start to think about data architecture much cleaner.

I made two changes to the traditional approach. First, instead of thinking about a "serving layer" (which implies some place I must go to get the data), I've changed it to **"Action Systems."** Action Systems are a conceptual framework within Event Driven Architectures that shift data consumption from passive reporting to automated, event-driven responses. This allows me to think about this data in ways that are beyond traditional reporting.

Notice too that data flows from the speed layer TO the batch layer. In Fabric Real Time Intelligence implementations, we see this happen in production deployments. How do I use OneLake availability to make data available in my Lakehouse for downstream reporting, then join this data into my data lake with other data?

The tradeoff here is that when making data available from the hot path into the cold path, there's a latency delay (anywhere from 5 minutes or more) before it can be used in these systems. In lambda architectures, this is a key decision point. If you need to process data for action systems within that 5-minute mark, you need to keep the data flowing. This requires a slightly different lens.

At first glance you might not notice the change 😊 However, we've flipped the arrow between speed and batch. **Instead of trying to move the hot data to the cold, slower path, move the cold data into the hot path.** This approach is far easier on processing speed, cost, and complexity.

The great thing about Fabric is that with OneLake integration, this architecture allows both streaming and batch data to coexist seamlessly, and you can use the right engine for the right job. In contrast, a typical cloud-based PaaS solution often requires duplicating data across multiple storage accounts for different workloads or use cases, resulting in higher complexity and increased storage costs.

## Getting Separation Right

This approach gives us some real separation. Developers know that cold stores are great at collating data, but when it comes to critical infrastructure needs such as query concurrency, response times, and BCDR, the conversation gets very complicated very quickly.

Instead of every user query from every application needing to hit a single location, you can **sectionalize queries based on the urgency of their request** (real-time vs historical). This allows additional scalability beyond putting all of the pressure on a singular location (which also creates a single point of failure). With this type of federation, we can also start to transition and decentralize our analytics needs to a data mesh type of deployment, if we so choose.

With this in mind though, it's unlikely that all data will be served by the speed layer OR by the batch layers alone (which is why we needed Lambda in the first place). The most accurate picture includes both paths serving different query patterns and use cases.

## When Stream Processing Isn't the Answer

Stream processing isn't a silver bullet. If you are trying to join dimension/reference data to identify a master record of an entity, or if your use cases generally don't require low-latency responses, you're better off sticking with batch processing. Complex joins across multiple historical datasets also work better in batch, where you have the full context available.

## Recommendations

**Start with your Action Systems requirements first.** Identify which use cases need real-time responses (sub-5-minute latency). An AI agent that takes a prescriptive action based on what's happening right now? An alert that triggers when compliance requirements are in danger of being exceeded? Those are stream processing use cases.

**Flip the traditional flow.** Instead of pushing hot data to cold storage and waiting, bring your cold data into the hot path when you need to enrich streaming events. This reduces complexity and improves performance.

**Leverage OneLake as your single source of truth.** Use Fabric's unified storage to eliminate data duplication across systems. This solves the governance nightmare of having the same data in multiple places.

**Design for separation of concerns.** Don't force all queries through a single bottleneck. Split real-time and historical query patterns across appropriate engines based on latency requirements.

**Choose batch when it makes sense.** If you are trying to implement master reference initiatives or require complex historical joins, batch processing is still your friend.

## Closing

The real power of modern platforms like Fabric isn't that they force you to choose streaming or batch. It's that they let you use both intelligently, in the same architecture, without duplicating your data or creating governance headaches.

What do YOU think? How are you rethinking your data architecture? I'd love to hear what patterns are working for you and where you're seeing challenges. Drop your thoughts in the comments or reach out. This space is evolving fast, and we're all learning together.
