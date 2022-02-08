import { BigInt } from "@graphprotocol/graph-ts";
import { createOrLoadBadgeDefinition } from "../Emblem/emblemModels";
import {
  BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
  BADGE_METRIC_DELEGATOR_INDEXERS,
  BADGE_METRIC_INDEXER_DELEGATOR_COUNT,
  BADGE_METRIC_INDEXER_QUERY_FEES_COLLECTED,
  BADGE_METRIC_INDEXER_SUBGRAPHS_INDEXED,
  BADGE_METRIC_PUBLISHER_SUBGRAPHS_DEPLOYED,
} from "../helpers/constants";

// In order for retroactive badge drops to cover the entire subgraph
// history, this function needs to be called from the first event.
export function generateGenesisBadgeDefinitions(): void {
  //////// INDEXER BADGES ////////

  createOrLoadBadgeDefinition(
    "Alchemist",
    "Index 1 Subgraph",
    BADGE_METRIC_INDEXER_SUBGRAPHS_INDEXED,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmPn3R7DwHmziQBEWB1KFj1tCshBMEVvx4Ss8577hvB6fq",
    0
  );
  createOrLoadBadgeDefinition(
    "Alchemist II",
    "Index 5 Subgraphs",
    BADGE_METRIC_INDEXER_SUBGRAPHS_INDEXED,
    BigInt.fromI32(5),
    BigInt.fromI32(2),
    "QmVMeDznjgqGUJzpp4V6ifgR1EB5puDLENhQsHMstNnjSq",
    1
  );
  createOrLoadBadgeDefinition(
    "Alchemist III",
    "Index 15 Subgraphs",
    BADGE_METRIC_INDEXER_SUBGRAPHS_INDEXED,
    BigInt.fromI32(15),
    BigInt.fromI32(3),
    "QmZj8qWbkjDScm4ruFJkc8HhSs64MRRHp7qm5xBS6Asv5h",
    2
  );

  createOrLoadBadgeDefinition(
    "Query Collector",
    "Collect 1k GRT in query fees",
    BADGE_METRIC_INDEXER_QUERY_FEES_COLLECTED,
    BigInt.fromI32(1000),
    BigInt.fromI32(1),
    "QmQtTg5s3AYv8txwXJVnfmUraAPhvPMi3y7QFx97T5an58",
    0
  );
  createOrLoadBadgeDefinition(
    "Query Collector II",
    "Collect 10k GRT in query fees",
    BADGE_METRIC_INDEXER_QUERY_FEES_COLLECTED,
    BigInt.fromI32(10000),
    BigInt.fromI32(1),
    "QmR4zGzHuJDoN93DAq7FBbXRPAYfgZAFCeHego7TC9Ff6f",
    1
  );

  createOrLoadBadgeDefinition(
    "Query Collector III",
    "Collect 25k GRT in query fees",
    BADGE_METRIC_INDEXER_QUERY_FEES_COLLECTED,
    BigInt.fromI32(25000),
    BigInt.fromI32(1),
    "QmP9Hv8kJQt3YXa1ng5kdqpd9nCCoqyD25R3Auz5h7ueAE",
    2
  );

  // createOrLoadBadgeDefinition(
  //   "Nexus",
  //   "Open 1 allocation",
  //   BADGE_METRIC_INDEXER_ALLOCATIONS_OPENED,
  //   BigInt.fromI32(1),
  //   BigInt.fromI32(1),
  //   "",
  //   0
  // );
  // createOrLoadBadgeDefinition(
  //   "Nexus II",
  //   "Open 10 allocations",
  //   BADGE_METRIC_INDEXER_ALLOCATIONS_OPENED,
  //   BigInt.fromI32(10),
  //   BigInt.fromI32(2),
  //   "",
  //   1
  // );
  // createOrLoadBadgeDefinition(
  //   "Nexus III",
  //   "Open 25 Allocations",
  //   BADGE_METRIC_INDEXER_ALLOCATIONS_OPENED,
  //   BigInt.fromI32(25),
  //   BigInt.fromI32(3),
  //   "",
  //   2
  // );

  createOrLoadBadgeDefinition(
    "Allegiance",
    "Receive GRT from 1 Delegator",
    BADGE_METRIC_INDEXER_DELEGATOR_COUNT,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmZhSwpQceLybgWH61rTNDPvN68mTQmUBME7c87bwH3w2J",
    0
  );
  createOrLoadBadgeDefinition(
    "Allegiance II",
    "Receive GRT from 25 Delegators",
    BADGE_METRIC_INDEXER_DELEGATOR_COUNT,
    BigInt.fromI32(25),
    BigInt.fromI32(2),
    "QmYSqMNC917NPxvooETy5AVBKQMMun2MVEFcxoktGHhohQ",
    1
  );
  createOrLoadBadgeDefinition(
    "Allegiance III",
    "Receive GRT from 100 Delegators",
    BADGE_METRIC_INDEXER_DELEGATOR_COUNT,
    BigInt.fromI32(100),
    BigInt.fromI32(3),
    "QmbPNXnTzY5BWELt9WpcDgRs4JHkb8UBDNdbthXS4JGvyk",
    2
  );

  //////// DELEGATOR BADGES ////////

  createOrLoadBadgeDefinition(
    "Guardian",
    "Delegate to 1 Indexer",
    BADGE_METRIC_DELEGATOR_INDEXERS,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmR4LXsfHnA3Ja3oftPoU8XvRbL7Drwkrm9dQnKmxcadKK",
    0
  );
  createOrLoadBadgeDefinition(
    "Guardian II",
    "Delegate to 3 Indexers",
    BADGE_METRIC_DELEGATOR_INDEXERS,
    BigInt.fromI32(3),
    BigInt.fromI32(2),
    "QmQFEtTFdE2hxwoH67eouzrozD8Aw92Z6xaVnFqdojhm2b",
    1
  );
  createOrLoadBadgeDefinition(
    "Guardian III",
    "Delegate to 10 Indexer",
    BADGE_METRIC_DELEGATOR_INDEXERS,
    BigInt.fromI32(10),
    BigInt.fromI32(3),
    "QmNW6dEDgYuwLnQk6bQqSBwKvXq6NkRk6H6asxcwhPf4GZ",
    2
  );
  // createOrLoadBadgeDefinition(
  //   "Guardian IV",
  //   "Delegate to 25 Indexers (100 GRT minimum)",
  //   BADGE_METRIC_DELEGATOR_INDEXERS,
  //   BigInt.fromI32(25),
  //   BigInt.fromI32(4),
  //   "QmQP2o2xnXPiqXpKXkto3uxry3Xwrai3RaXVHSevFYhJxf",
  //   3
  // );

  //////// CURATOR BADGES ////////

  createOrLoadBadgeDefinition(
    "Pathfinder",
    "Signal 1 Subgraph",
    BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmTMCkPW6A4EXyjFRU2fghtthhws5RTssb61dCTNcr7usy",
    0
  );
  createOrLoadBadgeDefinition(
    "Pathfinder II",
    "Signal 5 Subgraphs",
    BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
    BigInt.fromI32(5),
    BigInt.fromI32(2),
    "QmVURMTnATX6WT8B4fQ5JwU4P1ruCecgr2NSkFfKnYHLhJ",
    1
  );
  createOrLoadBadgeDefinition(
    "Pathfinder III",
    "Signal 10 Subgraphs",
    BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
    BigInt.fromI32(10),
    BigInt.fromI32(3),
    "QmPiV2RVDYgQGfP7NMWePfPvrNf16ErvFsucS4Rv7vcjAS",
    2
  );

  // createOrLoadBadgeDefinition(
  //   "House Odds",
  //   "Simultaneously Deploy and Signal on your Subgraph",
  //   BADGE_METRIC_CURATOR_HOUSE_ODDS,
  //   BigInt.fromI32(1),
  //   BigInt.fromI32(1),
  //   "",
  //   0
  // );

  // createOrLoadBadgeDefinition(
  //   "Planet of the Aped",
  //   "Signal within 100 blocks of a Subgraph's Deployment",
  //   BADGE_METRIC_CURATOR_APE,
  //   BigInt.fromI32(1),
  //   BigInt.fromI32(1),
  //   "",
  //   0
  // );

  //////// DEVELOPER BADGES ////////

  // createOrLoadBadgeDefinition(
  //   "Beacon",
  //   "Receive 1k GRT in Curator Signal on your Subgraphs",
  //   BADGE_METRIC_PUBLISHER_SIGNAL_ATTRACTED,
  //   BigInt.fromString("1000000000000000000000"),
  //   BigInt.fromI32(1),
  //   "",
  //   0
  // );
  // createOrLoadBadgeDefinition(
  //   "Beacon II",
  //   "Receive 10k GRT in Curator Signal on your Subgraphs",
  //   BADGE_METRIC_PUBLISHER_SIGNAL_ATTRACTED,
  //   BigInt.fromString("10000000000000000000000"),
  //   BigInt.fromI32(2),
  //   "",
  //   1
  // );
  // createOrLoadBadgeDefinition(
  //   "Beacon III",
  //   "Receive 30k GRT in Curator Signal on your Subgraphs",
  //   BADGE_METRIC_PUBLISHER_SIGNAL_ATTRACTED,
  //   BigInt.fromString("30000000000000000000000"),
  //   BigInt.fromI32(3),
  //   "",
  //   2
  // );

  createOrLoadBadgeDefinition(
    "Subgraph Smith",
    "Deploy 1 Subgraph to the Decentralized Network",
    BADGE_METRIC_PUBLISHER_SUBGRAPHS_DEPLOYED,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmWFEodHLQhVrBAL7nC6QgagREDeYsRC7eSGrtyohR6fbu",
    0
  );
  createOrLoadBadgeDefinition(
    "Subgraph Smith II",
    "Deploy 3 Subgraphs to the Decentralized Network",
    BADGE_METRIC_PUBLISHER_SUBGRAPHS_DEPLOYED,
    BigInt.fromI32(3),
    BigInt.fromI32(1),
    "QmVvV9osrbqmX54a6pTJRqDkgJUTsfNRK1Hk7fkD4EgXxz",
    1
  );
  createOrLoadBadgeDefinition(
    "Subgraph Smith III",
    "Deploy 10 Subgraphs to the Decentralized Network",
    BADGE_METRIC_PUBLISHER_SUBGRAPHS_DEPLOYED,
    BigInt.fromI32(10),
    BigInt.fromI32(3),
    "QmYy1TFzQkzjs3SPAcWrt5Z5X3Y8NdGcsTUbyWGhoDLtsb",
    2
  );
}
