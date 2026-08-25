---
title: "Understanding dimensions/reference data, late arrivals, and out of order events in Real Time Intelligence"
date: 2025-09-16
slug: understanding-dimensions-reference-data-late-arrivals
category: architecture-strategy
tags: [eventhouse, dimensions, reference-data, kql, late-arriving-data, fabric, real-time-intelligence]
url: https://christophermschmidt.com/articles/2025-09-16-understanding-dimensions-reference-data-late-arrivals
status: published
---

# Understanding dimensions/reference data, late arrivals, and out of order events in Real Time Intelligence

One of the interesting things I find about event-driven architectures in Microsoft Fabric is how, with the convergence of worlds, different terminologies that meant the same thing have now come to light. For example, take dimensions in classic data warehousing scenarios. In streaming data scenarios, we call this **contextualization** — essentially applying reference data to the stream of events coming in. Since events are really just time-series facts that are generated, some of the classic challenges that we have dealt with for a long time can be handled in new, more efficient ways.

For this article, I'm going to focus on **type 1 and type 2 dimensions**. Although there are other dimension types, this addresses the most common dimensional use cases. For a quick refresher, type 1 dimensions are updates of records, and type 2 is when history is stored via start/end effective dates (or begin/end effective, ValidFrom/To — whatever you call it). For the skilled BI practitioner, this is part and parcel of the day to day, and it comes with a particular set of requirements from the business.

## Type 1 and Type 2 Dimensions in Event-Driven Architectures

In Real Time Intelligence, these constructs are not referred to as "dimensions." They're called either **reference data, context data, or in some scenarios "tagging" the data**. Regardless of the terminology, the core goal remains the same: providing descriptive definitions around the stream of event-based data. How these descriptive definitions get applied is where we can start to leverage the power of Eventhouse.

**Did you know that Eventhouse in Fabric adds an ingestion time to every row inserted into the database by default?** This is very useful, especially for tracking history. It makes us begin to question certain dimension-specific requirements. Why do we need a start and end history effective date if the database by default tracks this? Snapshotting the dimension record daily gives us built-in type 2 historical attribute reporting, so why do we need to build complex logic in ELT pipelines to handle this? **It is far more efficient on a database engine to do a straight insert.** For those coming from the data warehousing world, think of Eventhouse as a built-in engine that creates a snapshot fact table on every table every time it's loaded.

For **"type 1" dimensions**, this also holds true. If you are not interested in the history of the data, simply delete the older loads. Anything older than today's snapshot gets deleted. Depending on how often you load this data, simply set the retention policy of Eventhouse to that duration. For example: if you're snapshotting a table from SQL as a dimension every 15 minutes and loading it into Eventhouse, setting the retention policy to 15 minutes simply deletes the previous runs of data (depending on your tolerance you may choose to keep the previous 2 or 3 snapshots and aggregate to the latest value when querying).

Now, you might be wondering: won't the database fall over if you snapshot every dimension every day? When applying type 1 logic, **there is no need to keep history at all** — just grab the latest value each day and set your retention policy. When applying type 2 logic, you're leveraging the power of the engine again. Remember that Eventhouses use **Extents, not traditional SQL and column store constructs**, which leads to different implementation patterns. Not all data has to be kept hot — the charge for storage in cold cache Eventhouse storage is exactly the same as the storage costs for OneLake.

You may choose to keep the last 30 or 60 days of data hot, and the rest in the cold cache to look at records when they were active. **I would argue this is simpler than traditional Type 2 implementations.** Trying to create a query to "find all of the product records that were active on a specific day in history" is not easy in SQL, because you have to search between start and end dates. In Eventhouse, simply query:

```kql
| where ingestion_time() == <whatever date you want to see history for>
```

Much simpler, and very performant — you are only querying a few extents, because extents are partitioned on ingestion_time by default.

### Loading Reference Data into Eventhouse

Within Fabric, there are a multitude of ways to load reference data into Eventhouse: Pipelines, Shortcuts, Eventstreams (yes, even reference data can be streamed!), and Notebooks. Because reference data typically moves at a much slower pace than pure operational data, the speed at which it is loaded can be slower too — anywhere from real time to daily batch loads.

**The crux is that we've simplified previously complicated upsert logic, without the need to create columns to track history.** Because everything is treated as an event, everything gets logged.

## Late Arriving Facts/Events

Similarly to how event publishing may lose connectivity or have a stream interrupted; time-series based fact tables may not get a feed for hours or a day or two, or during a data quality check users realize that an incorrect file was sent. This requires that data that has historically happened be loaded into the table. Commonly, I see users try to do this join directly within the Eventstream. **When data is arriving late, it is far more efficient to write this event to the storage engine and then do the join.** The join can then be done either at query time, or through update policies or materialized views.

KQL gives us very rich capabilities when it comes to dealing with this type of issue using some time series operators. Take the following example: a product dimension has changing attributes daily, and we receive a feed of data that has sales from the past 3 days. We want to identify the corresponding record that had the reference data active at the point in time the sale occurred:

```kql
let Clickstream = datatable(user_id:string, event_time:datetime)
[
    "1", datetime(2025-09-07 14:23:00),
    "2", datetime(2025-09-07 15:45:00),
    "1", datetime(2025-09-08 10:00:00)
];
let User = datatable(user_id:string, browser:string, pc_type:string, record_date:datetime)
[
    "1", "Chrome", "Desktop", datetime(2025-09-07),
    "1", "Firefox", "Laptop", datetime(2025-09-08),
    "2", "Edge", "Tablet", datetime(2025-09-07)
];
// Join clickstream events to the latest user snapshot on or before the event_time
Clickstream
| join kind=inner (
    User
) on user_id
| where record_date <= event_time
| summarize arg_max(record_date, browser, pc_type) by user_id, event_time
```

**In SQL, doing this join was not trivial, and does not perform well at scale.**

## Out of Order Event Handling

Another scenario you might run into is **out of order event handling**. In batch processing, this would be equivalent to processing multiple records with the same primary key in the same batch. In event-driven systems, this could happen due to network latency, distributed systems with asynchronous sources, buffering delay, or clock skew.

Imagine a clickstream system tracking user activity. A user visits a page on Sept 7, but the event arrives on Sept 9 due to network delay. You want to join this event with the UserProfile as it was on Sept 7, not Sept 9.

**The good news?** You've already solved this. Whether we call it late arriving data or out of order events, the solution is the same — use the query from the preceding section. At extremely high scale volumes, you may want to consider partitioning the data in Eventhouse based on the event time, not the ingestion time (as is the default), but this is not common.

Note that this is a different kind of out of order event handling than when you need to handle it at the broker level due to interconnected exchange systems when leveraging RTI as a message broker. That's a topic for another time. 🙂

## Alternative Scenario: Leveraging Existing Type 2 Dimensions

If you've already undergone the effort to create Type 2 dimensions with begin/end effective dates and are loading or creating shortcuts of the data into Eventhouse, don't get rid of that hard work — leverage it! Kusto has nice built-in operators for this, using the `between` clause in KQL:

```kql
let Events = datatable(EventId:int, EventTime:datetime, UserId:string)
[
    1, datetime(2023-01-01 10:00:00), "userA",
    2, datetime(2023-01-01 11:00:00), "userB",
    3, datetime(2023-01-01 12:00:00), "userA"
];
let Users = datatable(UserId:string, BeginEffectiveDatetime:datetime, EndEffectiveDatetime:datetime)
[
    "userA", datetime(2023-01-01 09:30:00), datetime(2023-01-01 10:30:00),
    "userA", datetime(2023-01-01 11:30:00), datetime(2023-01-01 12:30:00),
    "userB", datetime(2023-01-01 10:45:00), datetime(2023-01-01 11:15:00)
];
Events
| join kind=inner (
    Users
) on UserId
| where EventTime between (BeginEffectiveDatetime .. EndEffectiveDatetime)
```

## Key Takeaways

The transition from traditional data warehousing concepts to event-driven architectures doesn't mean abandoning proven patterns — it means **rethinking how to implement them more efficiently**. Eventhouse's built-in ingestion time tracking, extent-based storage, and KQL's powerful time-series operators provide elegant solutions to challenges that were complex in traditional SQL environments.

Whether you're dealing with reference data contextualization, late-arriving events, or out-of-order processing, the key is leveraging the strengths of the platform rather than fighting against them. **Embrace the event-driven mindset while maintaining the analytical rigor that dimensions and reference data provide.**
