---
title: "Building Action Systems on data in Azure SQL and SQL Server 2025 with Change Eventstreams"
date: 2025-11-06
slug: building-action-systems-azure-sql-change-eventstreams
category: architecture-strategy
tags: [action-systems, azure-sql, change-event-streaming, eventstream, eventhouse, real-time-intelligence, fabric]
url: https://christophermschmidt.com/articles/2025-11-06-building-action-systems-azure-sql-change-eventstreams
status: published
---

# Building Action Systems on data in Azure SQL and SQL Server 2025 with Change Eventstreams

With all the Ignite announcements this year, it's easy to overlook features you can start using right now. One of the most exciting additions now in public preview (and GA in SQL Server 2025 on-prem) is **Change Event Streaming (CES)**.

This feature unlocks powerful event-driven scenarios for databases deployed in Azure SQL. Today, we'll explore how to integrate Azure SQL with Microsoft Fabric using CES to build real-time, event-driven systems.

But first, let's start with the why.

## Why Use Change Event Streams?

**Business reasons:**

- Build event-driven systems on top of relational databases with minimal overhead and seamless integration
- Synchronize data across systems — especially between microservices or distributed architectures
- Enable real-time analytics on operational data
- Audit and monitor sensitive changes or log specific events
- Consolidate event data from multiple Azure SQL databases into a single Fabric endpoint in real time

**Technical reasons:**

- CES avoids writing back to the database (unlike CDC), reducing overhead
- Schema flexibility: each event includes the row schema. If a DDL change occurs (add, drop, rename column), the next DML event reflects the updated schema. CES does not emit DDL events.
- No primary key required

## How It Works

In addition to making data available in Fabric in real-time, leveraging Eventstream custom endpoints means change data from SQL can be made available for downstream consumption, Activator alerts can be triggered when new records are added, or data can be transformed and processed in real-time.

Enough background — let me show how this is done.

## Implementation Steps

To demonstrate, I've created an Azure SQL database with the Adventure Works sample database and a Fabric capacity (F8) where I'll set up the database to send change event streaming data. Within Fabric, I've created an Eventhouse and an Eventstream with a custom endpoint.

**Important:** Something that trips a lot of people up in Eventstream is that **schemas are not read until events are sent** (unless you are using schema registry). Your initial publish of the Eventstream should only be the custom endpoint — don't create the Eventhouse destination until you see events flowing into the stream. Otherwise, your Eventhouse will fail.

### Step 1: Enable Change Event Streaming in Azure SQL

```sql
-- Create the Master Key with a password, if it does not already exist.
CREATE MASTER KEY ENCRYPTION BY PASSWORD = '<>';

-- Create a database scoped credential to connect the database to your Fabric event stream.
CREATE DATABASE SCOPED CREDENTIAL EventstreamSAK
WITH
IDENTITY = '<>',
SECRET = '<>'

-- Enable event streaming in Azure SQL
EXEC sys.sp_enable_event_stream

-- Create the event stream group and input the event hub connection information
EXEC sys.sp_create_event_stream_group
    @stream_group_name = N'AzureSQLEventDriven',
    @destination_type = N'AzureEventHubsAmqp',
    @destination_location = N'<>.servicebus.windows.net/<>',
    @destination_credential = EventstreamSAK
-- The destination location comes from the custom endpoint you previously created.
-- Click on the Event Hub, select SAS Key Authentication, and retrieve the fields.

-- Run this command for each table you want to add to the group.
EXEC sys.sp_add_object_to_event_stream_group N'AzureSQLEventDriven', N'SalesLT.SalesOrderDetail'

-- If you run into errors, run this
SELECT * FROM sys.dm_change_feed_errors ORDER BY entry_time DESC
```

### Step 2: Generate Sample Data

After attaching the table and running some commands, you should see change events start to flow. I ran the following commands against AdventureWorks:

```sql
-- Validate Foreign Keys Before Insert
DECLARE @SalesOrderID INT = 71774;
DECLARE @ProductIDs TABLE (ProductID INT);
INSERT INTO @ProductIDs VALUES (709), (712), (714), (716), (718);

IF NOT EXISTS (SELECT 1 FROM SalesLT.SalesOrderHeader WHERE SalesOrderID = @SalesOrderID)
BEGIN
    PRINT 'Error: SalesOrderID does not exist.';
    RETURN;
END

-- Insert 5 Sample Rows
INSERT INTO SalesLT.SalesOrderDetail (SalesOrderID, OrderQty, ProductID, UnitPrice, UnitPriceDiscount, rowguid, ModifiedDate)
VALUES
    (@SalesOrderID, 2, 709, 125.00, 0.00, NEWID(), GETDATE()),
    (@SalesOrderID, 1, 712, 250.00, 10.00, NEWID(), GETDATE()),
    (@SalesOrderID, 3, 714, 75.00, 0.00, NEWID(), GETDATE()),
    (@SalesOrderID, 5, 716, 50.00, 5.00, NEWID(), GETDATE()),
    (@SalesOrderID, 2, 718, 300.00, 15.00, NEWID(), GETDATE());

-- Update Example
UPDATE SalesLT.SalesOrderDetail
SET OrderQty = 4, UnitPriceDiscount = 20.00, ModifiedDate = GETDATE()
WHERE SalesOrderDetailID = 110701;

-- Delete Example
DELETE FROM SalesLT.SalesOrderDetail
WHERE SalesOrderDetailID = 110703;
```

### Step 3: Configure Eventstream Connection

Switch back to Eventstream — you should see events flowing into the stream. If you are transforming data in Eventstream, select "Event Processing Before Ingestion". Otherwise select "Direct." After completing the configuration screen, your data should be available in the Eventhouse table.

## Implementation Considerations

**Single table setup:**

- Stable schema: use the built-in JSON parser in Eventhouse to parse columns out of the data column during ingestion and save yourself a step.
- Dynamic schema: use `DropMappedFields` in Kusto to build defensive coding mechanisms that capture additional future schema columns. Alternatively, use `bag_unpack` to materialize it at query time.

**Multiple tables:**

- Don't try to recreate all the tables in Eventhouse. Think of the ingested data as one big stream and pull out what you want.
- For tabular recreation: if you need to re-create the structured tabular view from SQL, take a look at Tyler Chessman's blog where he walks through how to do this with CDC-enabled tables.

## Real-Time Analytics Example

Now that this data is in Eventhouse, the door opens to Activator triggers for anomalies, real-time dashboards, Operations Agents, and more. Here's a query that calculates any order that came in over the past hour at more than 200% of normal — opening the door for real-time Activator rules that can notify instantly:

```kql
// Parse incoming events and compute line-level amount
let AllOrderLines =
    AzureSQLCESraw
    | where operation == "INS"
    | extend current = parse_json(data.eventrow.current)
    | extend CurrentJson = todynamic(current)
    | extend ParsedCurrentJson = parse_json(CurrentJson)
    | extend
        SalesOrderID         = tostring(ParsedCurrentJson.SalesOrderID),
        SalesOrderDetailID   = tostring(ParsedCurrentJson.SalesOrderDetailID),
        OrderQty             = toint(ParsedCurrentJson.OrderQty),
        UnitPrice            = todouble(ParsedCurrentJson.UnitPrice),
        UnitPriceDiscount    = todouble(ParsedCurrentJson.UnitPriceDiscount),
        ModifiedDate         = todatetime(ParsedCurrentJson.ModifiedDate)
    | extend line_amount = OrderQty * (UnitPrice - UnitPriceDiscount);

// Aggregate to order size
let PerOrderTotals =
    AllOrderLines
    | summarize
        order_total      = sum(line_amount),
        first_event_time = min(['time']),
        last_event_time  = max(['time'])
      by SalesOrderID;

// Global baseline: average order size across all records
let global_avg_order_total =
    toscalar(PerOrderTotals | summarize avg_order_total = avg(order_total));

// Anomalies: orders in the last hour exceeding 200% of global average
PerOrderTotals
| where last_event_time between (ago(1h) .. now())
| where order_total > 2.0 * global_avg_order_total
| project
    SalesOrderID,
    order_total,
    global_avg_order_total,
    threshold_200pct = 2.0 * global_avg_order_total,
    first_event_time,
    last_event_time
| order by order_total desc
```

## CU Consumption Analysis

Each data payload sent by SQL totaled 18.9 KB for 5 insert transactions, consuming **1.25 CU for Eventhouse** and **0.05003 CU for Eventstream.** The majority of the Eventstream charge was uptime, with a very small actual data charge.

A single insert event came in at 2.3 KB. Using this, we can estimate capacity needs at varying volumes:

| Events/Day | Data Volume | Capacity Needed |
| --- | --- | --- |
| 100,000 | 0.23 GB | F2 |
| 500,000 | 1.15 GB | F2–F4 |
| 1,000,000 | 2.3 GB | F4 |

Don't forget though that your number may change based on other workloads and downstream consumers of that data. 😊
