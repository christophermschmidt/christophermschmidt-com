---
title: "Seamlessly Ingesting XML Data into Eventhouse"
date: 2025-09-02
slug: seamlessly-ingesting-xml-data-eventhouse
category: real-time
tags: [eventhouse, xml, eventstream, kusto, kql, ingestion, azure-service-bus, update-policies, fabric]
url: https://christophermschmidt.com/articles/2025-09-02-seamlessly-ingesting-xml-data-eventhouse
status: published
---

# Seamlessly Ingesting XML Data into Eventhouse

As organizations increasingly rely on real-time data streaming for analytics and operations, integrating various data formats into modern event stores becomes a critical task. XML, while less common than JSON in cloud-native architectures, is still widely used for legacy integration and enterprise system interoperability. In this article, we'll explore how to load XML data sent to Microsoft Fabric Real Time Intelligence through direct ingestion and transform it into structured, queryable data using Kusto's `parse_xml` function in an update policy.

For this scenario, we'll be leveraging **Azure Service Bus as the source**. Note that this would work the same for any XML-based data source — Azure Event Hubs, Kafka, AWS Kinesis, etc. Azure Service Bus is a fully managed enterprise message broker, perfect for handling asynchronous communication between services. When a producer sends XML messages to a Service Bus queue or topic, these messages can be consumed by an Eventstream ingestion pipeline in real time.

**This approach ensures low-latency delivery and preserves the original XML format for flexible downstream processing.**

## Setting Up the Eventstream Connection

You can see I've created a simple source node in my Eventstream — an Azure Service Bus source receiving XML messages.

**The "secret," if you will, is that the only thing we want the Eventstream to do is to forward the message to the Eventhouse.** Think of it like opening a phone line. We don't need Eventstream to understand the language we're speaking (in this case XML) — we only want the Eventstream to function as the operator and facilitate the connection. Don't try and preview the data, as it won't always display. Simply create the connection and move immediately to the next step.

## Configuring Direct Ingestion

On the Eventstream canvas, add an **Eventhouse destination node** and configure it for **Direct Ingestion** (not Event Processing Before Ingestion — this is important). These two destination modes function very differently in Eventhouse:

- **Direct Ingestion** = Eventhouse pulls from the source
- **Event Processing Before Ingestion** = Eventstream pushes to Eventhouse

When you configure Eventhouse as Direct Ingestion, **Eventhouse bypasses the Eventstream to pull data directly from the upstream source**. However, when you leave it as the default (or select Event Processing Before Ingestion), Eventstream pushes data after reading it into Eventhouse. There are advantages to that approach (for example if you want to transform the data via SQL instead of update policies), but use Direct Ingestion when possible.

**Pro tip:** Eventhouse destinations configured for Direct Ingestion will also use fewer CUs.

## Configuration Process

Once this publishes, click "Configure" and select or create a table you want to load your data to. Make sure the Data Connection name is unique, and click Next.

On the next screen, notice that **Eventhouse has decided to pull this in as TXT.** You can see the full list of everything Eventhouse natively supports on the docs page for ingestion-supported formats.

**Pro tip:** If you select JSON as the data type, there is an option to configure the "Nested Levels" of the JSON. By default, Eventhouse evaluates your JSON structure and attempts to pull the schema at the default level. A handy approach to dealing with multiple schemas coming from your Eventstream is to turn this down to 0, have Eventhouse bring them in as 1 JSON object, and then break out the schemas in Eventhouse directly with Update policies.

For our XML scenario, **leave the data format type as TXT** and click Finish. Do not try and infer anything else from this screen. Once the Eventhouse table loads, you should see the raw XML data stored as strings.

## Parsing XML with KQL

Storing XML as a string is only the first step. **KQL provides the `parse_xml` function**, which can convert XML strings into dynamic objects, making it easy to extract fields and perform queries. Using our schema above, let's extract the structure:

```kql
ServiceBusXMLTest
| extend ParsedXML = parse_xml(data)
| project-away data
| extend Model=ParsedXML.MotorInstance.Model,
         Instance=ParsedXML.MotorInstance.InstanceId,
         Timestamp=ParsedXML.MotorInstance.Timestamp,
         Speed=ParsedXML.MotorInstance.Data.Speed,
         Temperature=ParsedXML.MotorInstance.Data.Temperature,
         Status=ParsedXML.MotorInstance.Data.Status
| project-away ParsedXML
```

## Automating with Update Policies

To process newly arriving data automatically, **Eventhouse supports update policies** — scripts that run when new data lands in a table. You can define an update policy on a destination table that ingests, parses, and transforms the raw XML into a well-structured schema:

```kql
// Step 1: Create the destination table
.create table StructuredMotorReadings (
    Model:string,
    Instance:string,
    Timestamp:datetime,
    Speed:real,
    Temperature:real,
    Status:string
)

// Step 2: Define the transformation function
.create function with (folder = "MotorReadings", docstring = "Extracts structured motor readings from XML payloads")
TransformMotorReadings() {
    ServiceBusXMLTest
    | extend ParsedXML = parse_xml(data)
    | project-away data
    | extend
        Model = tostring(ParsedXML.MotorInstance.Model),
        Instance = tostring(ParsedXML.MotorInstance.InstanceId),
        Timestamp = todatetime(ParsedXML.MotorInstance.Timestamp),
        Speed = todouble(ParsedXML.MotorInstance.Data.Speed),
        Temperature = todouble(ParsedXML.MotorInstance.Data.Temperature),
        Status = tostring(ParsedXML.MotorInstance.Data.Status)
    | project-away ParsedXML
}

// Step 3: Create the update policy
.alter table StructuredMotorReadings policy update
@'[{"IsEnabled":true,"Source":"ServiceBusXMLTest","Query":"TransformMotorReadings()","IsTransactional":false}]'
```

**With this policy in place, every new XML message ingested into `ServiceBusXMLTest` is instantly parsed and loaded into `StructuredMotorReadings` as structured records**, ready for any downstream action we want to take.

## Key Takeaways

By combining **Eventstream direct ingestion** and turning off mapping into Eventhouse, you can ingest any format supported by Kusto natively. This allows simple, straightforward no-code ingestion of any of these formats directly into the Eventhouse engine in real time.

Best practices: use Direct Ingestion when possible — it's more efficient and uses fewer CUs. Keep Eventstream simple — let it act as a conduit, not a processor. Store raw data first — ingest as TXT format to preserve original structure. Parse downstream — use update policies and KQL functions for transformation. Leverage native Kusto capabilities — supports many formats beyond JSON.

This approach provides a robust, scalable pattern for handling XML data in real-time intelligence scenarios while maintaining flexibility for future schema evolution.
