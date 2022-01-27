import { BigInt } from "@graphprotocol/graph-ts";
import { createOrLoadBadgeDefinition } from "../Emblem/emblemModels";
import {
  BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
  BADGE_METRIC_PUBLISHER_SUBGRAPHS_DEPLOYED,
  BADGE_METRIC_PUBLISHER_SIGNAL_ATTRACTED,
  BADGE_METRIC_CURATOR_HOUSE_ODDS,
  BADGE_METRIC_INDEXER_SUBGRAPHS_INDEXED,
  BADGE_METRIC_CURATOR_APE,
  BADGE_METRIC_INDEXER_QUERY_FEES_COLLECTED,
  BADGE_METRIC_INDEXER_ALLOCATIONS_OPENED,
  BADGE_METRIC_INDEXER_DELEGATOR_COUNT,
  BADGE_METRIC_DELEGATOR_INDEXERS,
} from "../helpers/constants";

// In order for retroactive badge drops to cover the entire subgraph
// history, this function needs to be called from the first event.
export function generateGenesisBadgeDefinitions(): void {
  //////// INDEXER BADGES ////////

  createOrLoadBadgeDefinition(
    "Subgraph Alchemist I",
    "Index 1 Subgraph",
    BADGE_METRIC_INDEXER_SUBGRAPHS_INDEXED,
    BigInt.fromI32(1),
    BigInt.fromI32(1)
  );
  createOrLoadBadgeDefinition(
    "Subgraph Alchemist II",
    "Index 5 Subgraphs",
    BADGE_METRIC_INDEXER_SUBGRAPHS_INDEXED,
    BigInt.fromI32(5),
    BigInt.fromI32(2)
  );
  createOrLoadBadgeDefinition(
    "Subgraph Alchemist III",
    "Index 15 Subgraphs",
    BADGE_METRIC_INDEXER_SUBGRAPHS_INDEXED,
    BigInt.fromI32(15),
    BigInt.fromI32(3)
  );

  createOrLoadBadgeDefinition(
    "Query Collector I",
    "Collect 1,000 GRT in Query Fees",
    BADGE_METRIC_INDEXER_QUERY_FEES_COLLECTED,
    BigInt.fromI32(1000),
    BigInt.fromI32(1)
  );
  createOrLoadBadgeDefinition(
    "Query Collector II",
    "Collect 10,000 GRT in Query Fees",
    BADGE_METRIC_INDEXER_QUERY_FEES_COLLECTED,
    BigInt.fromI32(10000),
    BigInt.fromI32(1)
  );

  createOrLoadBadgeDefinition(
    "Nexus I",
    "Open 1 Allocation",
    BADGE_METRIC_INDEXER_ALLOCATIONS_OPENED,
    BigInt.fromI32(1),
    BigInt.fromI32(1)
  );
  createOrLoadBadgeDefinition(
    "Nexus II",
    "Open 10 Allocations",
    BADGE_METRIC_INDEXER_ALLOCATIONS_OPENED,
    BigInt.fromI32(10),
    BigInt.fromI32(2)
  );
  createOrLoadBadgeDefinition(
    "Nexus III",
    "Open 25 Allocations",
    BADGE_METRIC_INDEXER_ALLOCATIONS_OPENED,
    BigInt.fromI32(25),
    BigInt.fromI32(3)
  );

  createOrLoadBadgeDefinition(
    "Allegiance I",
    "Receieve GRT from 1 Delegator",
    BADGE_METRIC_INDEXER_DELEGATOR_COUNT,
    BigInt.fromI32(1),
    BigInt.fromI32(1)
  );
  createOrLoadBadgeDefinition(
    "Allegiance II",
    "Receieve GRT from 25 Delegators",
    BADGE_METRIC_INDEXER_DELEGATOR_COUNT,
    BigInt.fromI32(25),
    BigInt.fromI32(2)
  );
  createOrLoadBadgeDefinition(
    "Allegiance III",
    "Receieve GRT from 100 Delegators",
    BADGE_METRIC_INDEXER_DELEGATOR_COUNT,
    BigInt.fromI32(100),
    BigInt.fromI32(3)
  );

  //////// DELEGATOR BADGES ////////

  createOrLoadBadgeDefinition(
    "Guardian I",
    "Delegate to 1 Indexer (100 GRT Delegation Minimum)",
    BADGE_METRIC_DELEGATOR_INDEXERS,
    BigInt.fromI32(1),
    BigInt.fromI32(1)
  );
  createOrLoadBadgeDefinition(
    "Guardian II",
    "Delegate to 3 Indexers (100 GRT Delegation Minimum)",
    BADGE_METRIC_DELEGATOR_INDEXERS,
    BigInt.fromI32(3),
    BigInt.fromI32(2)
  );
  createOrLoadBadgeDefinition(
    "Guardian III",
    "Delegate to 10 Indexer (100 GRT Delegation Minimum)",
    BADGE_METRIC_DELEGATOR_INDEXERS,
    BigInt.fromI32(10),
    BigInt.fromI32(3)
  );
  createOrLoadBadgeDefinition(
    "Guardian IV",
    "Delegate to 25 Indexers (100 GRT Delegation Minimum)",
    BADGE_METRIC_DELEGATOR_INDEXERS,
    BigInt.fromI32(25),
    BigInt.fromI32(4)
  );
  createOrLoadBadgeDefinition(
    "Guardian V",
    "Delegate to 50 Indexers (100 GRT Delegation Minimum)",
    BADGE_METRIC_DELEGATOR_INDEXERS,
    BigInt.fromI32(50),
    BigInt.fromI32(5)
  );

  //////// CURATOR BADGES ////////

  createOrLoadBadgeDefinition(
    "Pathfinder",
    "Signal 1 Subgraph",
    BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
    BigInt.fromI32(1),
    BigInt.fromI32(1)
  );
  createOrLoadBadgeDefinition(
    "Pathfinder II",
    "Signal 5 Subgraphs",
    BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
    BigInt.fromI32(5),
    BigInt.fromI32(2)
  );
  createOrLoadBadgeDefinition(
    "Pathfinder III",
    "Signal 10 Subgraphs",
    BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
    BigInt.fromI32(10),
    BigInt.fromI32(3)
  );

  createOrLoadBadgeDefinition(
    "House Odds",
    "Be the first to curate on your own subgraph",
    BADGE_METRIC_CURATOR_HOUSE_ODDS,
    BigInt.fromI32(1),
    BigInt.fromI32(1)
  );

  createOrLoadBadgeDefinition(
    "Planet of the Aped",
    "Curate on another user's subgraph within 100 blocks",
    BADGE_METRIC_CURATOR_APE,
    BigInt.fromI32(1),
    BigInt.fromI32(1)
  );

  //////// DEVELOPER BADGES ////////

  createOrLoadBadgeDefinition(
    "Beacon I",
    "Attract 1k GRT of SIgnal from Curators",
    BADGE_METRIC_PUBLISHER_SIGNAL_ATTRACTED,
    BigInt.fromString("1000000000000000000000"),
    BigInt.fromI32(1)
  );
  createOrLoadBadgeDefinition(
    "Beacon II",
    "Attract 10k GRT of SIgnal from Curators",
    BADGE_METRIC_PUBLISHER_SIGNAL_ATTRACTED,
    BigInt.fromString("10000000000000000000000"),
    BigInt.fromI32(2)
  );
  createOrLoadBadgeDefinition(
    "Beacon III",
    "Attract 30k GRT of SIgnal from Curators",
    BADGE_METRIC_PUBLISHER_SIGNAL_ATTRACTED,
    BigInt.fromString("30000000000000000000000"),
    BigInt.fromI32(3)
  );

  createOrLoadBadgeDefinition(
    "Subgraph Smith I",
    "Deploy 1 Subgraph to the Decentralized Network",
    BADGE_METRIC_PUBLISHER_SUBGRAPHS_DEPLOYED,
    BigInt.fromI32(1),
    BigInt.fromI32(1)
  );
  createOrLoadBadgeDefinition(
    "Subgraph Smith II",
    "Deploy 3 Subgraphs to the Decentralized Network",
    BADGE_METRIC_PUBLISHER_SUBGRAPHS_DEPLOYED,
    BigInt.fromI32(3),
    BigInt.fromI32(1)
  );
  createOrLoadBadgeDefinition(
    "Subgraph Smith III",
    "Deploy 10 Subgraphs to the Decentralized Network",
    BADGE_METRIC_PUBLISHER_SUBGRAPHS_DEPLOYED,
    BigInt.fromI32(10),
    BigInt.fromI32(3)
  );
}
