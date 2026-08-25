---
title: "Understanding CU consumption of streaming systems in Microsoft Fabric"
date: 2026-01-08
slug: understanding-cu-consumption-streaming-systems
category: real-time
tags: [fabric, eventhouse, eventstream, spark, cu-consumption, capacity-planning, real-time-intelligence]
url: https://christophermschmidt.com/articles/2026-01-08-understanding-cu-consumption-streaming-systems
status: published
---

# Understanding CU consumption of streaming systems in Microsoft Fabric

I really struggled with a title for this post, because it covers a lot of ground. It's a long read, but totally worth it. Ultimately I settled on "Understanding CU consumption of streaming systems in Fabric." I have been wanting to understand for a while the impact various architectural decisions can make on Fabric ingestion, and over the holidays I finally had time to play with it. The article below walks through architectural considerations for loading data into Fabric, and the decisions and tradeoffs.

I used the ubiquitous NYC Taxi dataset, and picked a single month (May of 2025). For the month of May, I created a few ground rules on the data. The average number of yellow trips per day in May of 2025 was 150K, so I looked at it two different ways:

1. **Streaming the data to an Eventstream** using an average number of rows per second throughout the day (2), landing and refining the data in Eventhouse using update policies.
2. **Using Spark Structured Streaming** to stream the data from an Azure Event Hub to a notebook, applying the silver transformation in flight and landing the data directly to a silver table.

## Test Objectives

The goal was to provide an objective viewpoint of the various tools available to stream data in real-time into Fabric, and the impact on CU consumption by choosing each option. For the 2 streaming solutions I also measured end-to-end latency, to see which streaming solution in Fabric was quicker.

**Technical clarifications:**

- Eventstreams used push (event processing before ingestion) to connect to Eventhouse. No special properties were set in the Eventstream.
- Solution scope is limited to ingesting data into the compute engine (either Lakehouse or Eventhouse). Refreshing semantic models or using other action systems is not included. The focus is the pure cost of CU ingestion and transformation.
- Native Fabric services were leveraged as much as possible. The generation scripts were intentionally built to be deployed as a separate solution to run locally or outside of Fabric — to alleviate any "internal" backchannels and get a realistic sense of latency coming from an outside source.

I assumed the data coming in was raw and in a real world would need to be refined and transformed.

**Architecture flows:**

- Real-Time Intelligence (RTI): Event Hub → Eventstream → Eventhouse (with transformation)
- Spark Structured Streaming: Event Hub → Spark Notebook → Lakehouse (with transformation in flight)

I felt like this was a fair assumption of various architectures that customers may use. I could have excluded the event hub in the RTI architecture and sent directly to Eventstream — this would have further decreased latency and real production workload cost — however I did not do this for two reasons: batch comparison consistency (by sending everything to Event Hub I could easily compare an exact batch's performance across approaches) and realistic latency modeling.

## Test Setup and Monitoring

I pre-created all services and always create the monitoring database. I created a custom visualization on top of the Fabric Capacity metrics app (thanks Sandeep Pawar for your help on that!) that breaks down CU usage of each artifact by hour, which let me calculate latency, CU cost, and estimated capacity sizing for each batch run.

## Test Results

### Initial 15-minute Tests

| Test Type | Run | Message Count | CU/s | Average Latency (Ms) |
| --- | --- | --- | --- | --- |
| RTI — Eventstream (Push) | 1 | 2 events/sec | 1.1855 | 747 |
| RTI — Eventhouse | 1 | 2 events/sec | 0.8625 | — |
| RTI — Eventstream (Push) | 2 | 2 events/sec | 2.0740 | 649 |
| RTI — Eventhouse | 2 | 2 events/sec | 0.0002 | — |
| Spark SS to Lakehouse (Default) | 1 | 2 events/sec | 7.0008 | 2244 |
| Spark SS (Small Pool) | 2 | 2 events/sec | 2.4508 | 1447 |

I was surprised by a few results. Eventhouse used far fewer CUs than expected in both tests (not even averaging 1 CU/s). When using Spark SS, setting the compute pool size to small helped dramatically — moving from 7 CU/s to 2.5 CU/s while also improving latency. This worked well at small scale but did not hold up when run for an extended period.

### Extended 2-Hour Validation Tests

| Test Type | Message Count | CU/s | Average Latency |
| --- | --- | --- | --- |
| RTI — Eventstream (Push) | 2 events/sec | 1.779 | 669ms |
| RTI — Eventhouse | 2 events/sec | 1.894 | — |
| Spark SS (Small Pool) | 2 events/sec | 4.77 | 15183ms |

Key observations: Notebooks pin all consumption to the start hour of when the notebook ran, whereas RTI workloads show more even distribution — which leads to a perceived hike in the notebook run. The small pool gains were lost over time (large latency due to back-pressure, increased CU consumption, higher CU/s). Eventstream and Eventhouse were extremely consistent, running between 1 and 2 CU/s throughout.

### Volume Scale Testing

I ran all future tests at 2 hours and scaled up volume significantly.

**10X Volume (20 EPS):**

| Test Type | CU/s | Average Latency |
| --- | --- | --- |
| RTI (Eventstream + Eventhouse) | 3.59 | 617ms |
| Spark SS (Default) | 13.70 | 2329ms |

**100X Volume (200 EPS):**

| Test Type | CU/s | Average Latency |
| --- | --- | --- |
| RTI (Eventstream + Eventhouse) | 3.418 | 649ms |
| Spark SS | 23.45 | 18999ms |

The volume flow usage is relatively consistent for Eventstream + Eventhouse, while the Spark notebook consumes CUs very differently. Since it appears to "take out a loan and then pay it back," throttling occurs as the notebook tries to provision something high against the capacity and then encounters limits. Contrast that to Eventstream, which "pays as it goes" and scales much more smoothly.

**Key takeaway: the larger the volume, the more it pushes you into RTI.**

It also presents an alarming fact — the Spark SS notebook gets more expensive as data volume grows. At 2 EPS, CU was around 2.4–5. At 20 EPS it went to 14, then 23.45 at 200 EPS.

### Maximum Volume Test (5,000 EPS)

| Test Type | CU/s | Average Latency |
| --- | --- | --- |
| RTI (Eventstream + Eventhouse) | 7.17 | 1386ms |
| Spark SS (Default) | 12.775 | 37976ms |

I stopped at 5,000 EPS. This is equivalent to 121 GB of data being ingested per day, fitting nicely inside of an F64 with RTI.

## Key Insights

### Understanding RTI Pricing

A key concept: **RTI pricing is volume-based, not row-count-based.** You will be charged the same whether you ingest 1 GB's worth of data at 1024 messages of 1 MB each or 1,048,576 messages at 1 KB each. Understand the average size of a row before starting any streaming project. This is similar to how other streaming platforms work — Amazon Kinesis or Confluent Kafka behave the same way.

### Capacity Planning

The average row size for the NYC Taxi dataset is about 200–300 bytes per row. At 300 bytes and 2 events per second, you're ingesting roughly 0.05 GB per day (2 × 86,400 × 300 = 51.9M bytes). That scales predictably.

| Events/Day | Daily Volume | Events Per Second |
| --- | --- | --- |
| 173,000 | 0.04 GB | 2 |
| 1,500,000 | 0.42 GB | 20 |
| 15,000,000 | 4.19 GB | 200 |
| 432,000,000 | 121 GB | 5,000 |

## Production Recommendations

**Skip Event Hub when possible.** Using a custom endpoint in Eventstream allows you to skip that hop, resulting in lower CU usage and likely improved latency.

**Use direct ingestion for transformations.** Unless data is being transformed within the Eventstream, don't use Event Processing Before (Push). Leverage direct ingestion — it uses fewer CUs when you're transforming in Eventhouse.

**RTI uses pay-as-you-go pricing.** Rather than consuming a large chunk of CUs upfront, both core RTI services use a SaaS-style approach. At first glance they may look expensive, but broken down to per hour or per second, they're very cost-effective.

**Accurate forecasting is possible.** We can accurately forecast Fabric capacity costs based on current and planned usage as we scale. The math is straightforward once you know your average row size and daily volume.
