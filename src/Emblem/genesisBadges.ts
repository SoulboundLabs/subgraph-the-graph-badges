import { BigInt } from "@graphprotocol/graph-ts";
import { createOrLoadBadgeDefinition } from "../Emblem/emblemModels";
import {
  BADGE_METRIC_CURATOR_APE,
  BADGE_METRIC_CURATOR_HOUSE_ODDS,
  BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
  BADGE_METRIC_DELEGATOR_INDEXERS,
  BADGE_METRIC_INDEXER_ALLOCATIONS_OPENED,
  BADGE_METRIC_INDEXER_DELEGATOR_COUNT,
  BADGE_METRIC_INDEXER_QUERY_FEES_COLLECTED,
  BADGE_METRIC_INDEXER_SUBGRAPHS_INDEXED,
  BADGE_METRIC_PUBLISHER_SIGNAL_ATTRACTED,
  BADGE_METRIC_PUBLISHER_SUBGRAPHS_DEPLOYED,
} from "../helpers/constants";

// In order for retroactive badge drops to cover the entire subgraph
// history, this function needs to be called from the first event.
export function generateGenesisBadgeDefinitions(): void {
  //////// INDEXER BADGES ////////

  createOrLoadBadgeDefinition(
    "Subgraph Alchemist",
    "Index 1 Subgraph",
    BADGE_METRIC_INDEXER_SUBGRAPHS_INDEXED,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmPn3R7DwHmziQBEWB1KFj1tCshBMEVvx4Ss8577hvB6fq"
  );
  createOrLoadBadgeDefinition(
    "Subgraph Alchemist II",
    "Index 5 Subgraphs",
    BADGE_METRIC_INDEXER_SUBGRAPHS_INDEXED,
    BigInt.fromI32(5),
    BigInt.fromI32(2),
    "QmVMeDznjgqGUJzpp4V6ifgR1EB5puDLENhQsHMstNnjSq"
  );
  createOrLoadBadgeDefinition(
    "Subgraph Alchemist III",
    "Index 15 Subgraphs",
    BADGE_METRIC_INDEXER_SUBGRAPHS_INDEXED,
    BigInt.fromI32(15),
    BigInt.fromI32(3),
    "QmZj8qWbkjDScm4ruFJkc8HhSs64MRRHp7qm5xBS6Asv5h"
  );

  createOrLoadBadgeDefinition(
    "Query Collector I",
    "Collect 1,000 GRT in query fees",
    BADGE_METRIC_INDEXER_QUERY_FEES_COLLECTED,
    BigInt.fromI32(1000),
    BigInt.fromI32(1),
    "QmQtTg5s3AYv8txwXJVnfmUraAPhvPMi3y7QFx97T5an58"
  );
  createOrLoadBadgeDefinition(
    "Query Collector II",
    "Collect 10,000 GRT in query fees",
    BADGE_METRIC_INDEXER_QUERY_FEES_COLLECTED,
    BigInt.fromI32(10000),
    BigInt.fromI32(1),
    "QmR4zGzHuJDoN93DAq7FBbXRPAYfgZAFCeHego7TC9Ff6f"
  );

  createOrLoadBadgeDefinition(
    "Nexus",
    "Open 1 allocation",
    BADGE_METRIC_INDEXER_ALLOCATIONS_OPENED,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmP9Hv8kJQt3YXa1ng5kdqpd9nCCoqyD25R3Auz5h7ueAE"
  );
  createOrLoadBadgeDefinition(
    "Nexus II",
    "Open 10 allocations",
    BADGE_METRIC_INDEXER_ALLOCATIONS_OPENED,
    BigInt.fromI32(10),
    BigInt.fromI32(2),
    ""
  );
  createOrLoadBadgeDefinition(
    "Nexus III",
    "Open 25 allocations",
    BADGE_METRIC_INDEXER_ALLOCATIONS_OPENED,
    BigInt.fromI32(25),
    BigInt.fromI32(3),
    ""
  );

  createOrLoadBadgeDefinition(
    "Allegiance",
    "Receive GRT from 1 Delegator",
    BADGE_METRIC_INDEXER_DELEGATOR_COUNT,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    ""
  );
  createOrLoadBadgeDefinition(
    "Allegiance II",
    "Receive GRT from 25 Delegators",
    BADGE_METRIC_INDEXER_DELEGATOR_COUNT,
    BigInt.fromI32(25),
    BigInt.fromI32(2),
    ""
  );
  createOrLoadBadgeDefinition(
    "Allegiance III",
    "Receive GRT from 100 Delegators",
    BADGE_METRIC_INDEXER_DELEGATOR_COUNT,
    BigInt.fromI32(100),
    BigInt.fromI32(3),
    ""
  );

  //////// DELEGATOR BADGES ////////

  createOrLoadBadgeDefinition(
    "Guardian",
    "Delegate to 1 Indexer (100 GRT minimum)",
    BADGE_METRIC_DELEGATOR_INDEXERS,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmR4LXsfHnA3Ja3oftPoU8XvRbL7Drwkrm9dQnKmxcadKK"
  );
  createOrLoadBadgeDefinition(
    "Guardian II",
    "Delegate to 3 Indexers (100 GRT minimum)",
    BADGE_METRIC_DELEGATOR_INDEXERS,
    BigInt.fromI32(3),
    BigInt.fromI32(2),
    "QmQFEtTFdE2hxwoH67eouzrozD8Aw92Z6xaVnFqdojhm2b"
  );
  createOrLoadBadgeDefinition(
    "Guardian III",
    "Delegate to 10 Indexer (100 GRT minimum)",
    BADGE_METRIC_DELEGATOR_INDEXERS,
    BigInt.fromI32(10),
    BigInt.fromI32(3),
    "QmNW6dEDgYuwLnQk6bQqSBwKvXq6NkRk6H6asxcwhPf4GZ"
  );
  createOrLoadBadgeDefinition(
    "Guardian IV",
    "Delegate to 25 Indexers (100 GRT minimum)",
    BADGE_METRIC_DELEGATOR_INDEXERS,
    BigInt.fromI32(25),
    BigInt.fromI32(4),
    "QmQP2o2xnXPiqXpKXkto3uxry3Xwrai3RaXVHSevFYhJxf"
  );

  //////// CURATOR BADGES ////////

  createOrLoadBadgeDefinition(
    "Pathfinder",
    "Signal 1 Subgraph",
    BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmTMCkPW6A4EXyjFRU2fghtthhws5RTssb61dCTNcr7usy"
  );
  createOrLoadBadgeDefinition(
    "Pathfinder II",
    "Signal 5 Subgraphs",
    BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
    BigInt.fromI32(5),
    BigInt.fromI32(2),
    "QmVURMTnATX6WT8B4fQ5JwU4P1ruCecgr2NSkFfKnYHLhJ"
  );
  createOrLoadBadgeDefinition(
    "Pathfinder III",
    "Signal 10 Subgraphs",
    BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
    BigInt.fromI32(10),
    BigInt.fromI32(3),
    "QmPiV2RVDYgQGfP7NMWePfPvrNf16ErvFsucS4Rv7vcjAS"
  );

  createOrLoadBadgeDefinition(
    "House Odds",
    "Be the first to curate on your own subgraph",
    BADGE_METRIC_CURATOR_HOUSE_ODDS,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    ""
  );

  createOrLoadBadgeDefinition(
    "Planet of the Aped",
    "Curate on another user's subgraph within 100 blocks",
    BADGE_METRIC_CURATOR_APE,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    ""
  );

  //////// DEVELOPER BADGES ////////

  createOrLoadBadgeDefinition(
    "Beacon",
    "Attract 1k GRT of signal from curators",
    BADGE_METRIC_PUBLISHER_SIGNAL_ATTRACTED,
    BigInt.fromString("1000000000000000000000"),
    BigInt.fromI32(1),
    ""
  );
  createOrLoadBadgeDefinition(
    "Beacon II",
    "Attract 10k GRT of signal from curators",
    BADGE_METRIC_PUBLISHER_SIGNAL_ATTRACTED,
    BigInt.fromString("10000000000000000000000"),
    BigInt.fromI32(2),
    ""
  );
  createOrLoadBadgeDefinition(
    "Beacon III",
    "Attract 30k GRT of signal from curators",
    BADGE_METRIC_PUBLISHER_SIGNAL_ATTRACTED,
    BigInt.fromString("30000000000000000000000"),
    BigInt.fromI32(3),
    ""
  );

  createOrLoadBadgeDefinition(
    "Subgraph Smith",
    "Deploy 1 subgraph to the Decentralized Network",
    BADGE_METRIC_PUBLISHER_SUBGRAPHS_DEPLOYED,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmWFEodHLQhVrBAL7nC6QgagREDeYsRC7eSGrtyohR6fbu"
  );
  createOrLoadBadgeDefinition(
    "Subgraph Smith II",
    "Deploy 3 subgraphs to the Decentralized Network",
    BADGE_METRIC_PUBLISHER_SUBGRAPHS_DEPLOYED,
    BigInt.fromI32(3),
    BigInt.fromI32(1),
    "QmVvV9osrbqmX54a6pTJRqDkgJUTsfNRK1Hk7fkD4EgXxz"
  );
  createOrLoadBadgeDefinition(
    "Subgraph Smith III",
    "Deploy 10 subgraphs to the Decentralized Network",
    BADGE_METRIC_PUBLISHER_SUBGRAPHS_DEPLOYED,
    BigInt.fromI32(10),
    BigInt.fromI32(3),
    "QmYy1TFzQkzjs3SPAcWrt5Z5X3Y8NdGcsTUbyWGhoDLtsb"
  );
}
