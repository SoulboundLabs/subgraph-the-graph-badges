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
    "QmUEaHQdXoAcNeyyNmm6G4WGHkUdxTyq42M41bcitzoiyr"
  );
  createOrLoadBadgeDefinition(
    "Alchemist II",
    "Index 5 Subgraphs",
    BADGE_METRIC_INDEXER_SUBGRAPHS_INDEXED,
    BigInt.fromI32(5),
    BigInt.fromI32(2),
    "QmdGCw5KPVZSEnjnETJjScTfikPHU1a3u79iygv5dCd8LW"
  );
  createOrLoadBadgeDefinition(
    "Alchemist III",
    "Index 15 Subgraphs",
    BADGE_METRIC_INDEXER_SUBGRAPHS_INDEXED,
    BigInt.fromI32(15),
    BigInt.fromI32(3),
    "QmXLWweMekLqNik3PAw3XaV2ADY9ZqNbNUfgBBcm3cBQt7"
  );

  createOrLoadBadgeDefinition(
    "Query Collector",
    "Collect 1k GRT in query fees",
    BADGE_METRIC_INDEXER_QUERY_FEES_COLLECTED,
    BigInt.fromI32(1000),
    BigInt.fromI32(1),
    "QmWoj4di4bukC81PNCeSRSuQqEhLoo75XHANvuz7n4ejPe"
  );
  createOrLoadBadgeDefinition(
    "Query Collector II",
    "Collect 10k GRT in query fees",
    BADGE_METRIC_INDEXER_QUERY_FEES_COLLECTED,
    BigInt.fromI32(10000),
    BigInt.fromI32(1),
    "QmdcHm17vat66zXFkjjACZWcRWpik7DVE7WZTkdjQtaZpu"
  );

  createOrLoadBadgeDefinition(
    "Query Collector III",
    "Collect 25k GRT in query fees",
    BADGE_METRIC_INDEXER_QUERY_FEES_COLLECTED,
    BigInt.fromI32(25000),
    BigInt.fromI32(1),
    "QmNN7exESvL8jcoyVbroFf7vkFUa697jenR8E7fX3nyRTa"
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
    "QmXgB1WoFF428Za3ZNdV4UTk37SLZYone8frDvatzQZQYK"
  );
  createOrLoadBadgeDefinition(
    "Allegiance II",
    "Receive GRT from 25 Delegators",
    BADGE_METRIC_INDEXER_DELEGATOR_COUNT,
    BigInt.fromI32(25),
    BigInt.fromI32(2),
    "QmQLccipGjZRQmvbUcQ6wJq8kJakzzPDxXXtAtBAsZi4MS"
  );
  createOrLoadBadgeDefinition(
    "Allegiance III",
    "Receive GRT from 100 Delegators",
    BADGE_METRIC_INDEXER_DELEGATOR_COUNT,
    BigInt.fromI32(100),
    BigInt.fromI32(3),
    "QmRtiUL6t1xF2Uovn3nG5Tpn8sRryX1SCnznVUrHbiqpVx"
  );

  //////// DELEGATOR BADGES ////////

  createOrLoadBadgeDefinition(
    "Guardian",
    "Delegate to 1 Indexer",
    BADGE_METRIC_DELEGATOR_INDEXERS,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmUPwGioNXezPMxTfarqQeHsWsnMAU78rAxCvcSfHP3FAV"
  );
  createOrLoadBadgeDefinition(
    "Guardian II",
    "Delegate to 3 Indexers",
    BADGE_METRIC_DELEGATOR_INDEXERS,
    BigInt.fromI32(3),
    BigInt.fromI32(2),
    "QmQezYFjQNzFs1cj1No2EFTXbURMLKv91ig3LyqNqYpkb2"
  );
  createOrLoadBadgeDefinition(
    "Guardian III",
    "Delegate to 10 Indexer",
    BADGE_METRIC_DELEGATOR_INDEXERS,
    BigInt.fromI32(10),
    BigInt.fromI32(3),
    "QmQh8Yj4yPskDDnoSYPePndHZtiRcpU1Hv9ZKhDozsibZ4"
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
    "QmcHq3c7iVofoNKS9Fs1JgopuwdJ2bULq6V4PKv8QSyj3W"
  );
  createOrLoadBadgeDefinition(
    "Pathfinder II",
    "Signal 5 Subgraphs",
    BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
    BigInt.fromI32(5),
    BigInt.fromI32(2),
    "Qma2xWEBGDfA4ZPcSQK63VyDNYTvBDH7qyziJnbReA9okH"
  );
  createOrLoadBadgeDefinition(
    "Pathfinder III",
    "Signal 10 Subgraphs",
    BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
    BigInt.fromI32(10),
    BigInt.fromI32(3),
    "QmcuHtFdcFgQo1VrqBMCvbm9NdPrXBUB498T47aAKKNMTe"
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
    "Qmb82JUQeEhH2wFP7KyYz6pPXiRPrg6SqLMVo65r3r1fHq"
  );
  createOrLoadBadgeDefinition(
    "Subgraph Smith II",
    "Deploy 3 Subgraphs to the Decentralized Network",
    BADGE_METRIC_PUBLISHER_SUBGRAPHS_DEPLOYED,
    BigInt.fromI32(3),
    BigInt.fromI32(1),
    "QmdrG6SoScdMtBPSSZBabembeAXmtWxm7AwUPQUyN6cj2o"
  );
  createOrLoadBadgeDefinition(
    "Subgraph Smith III",
    "Deploy 10 Subgraphs to the Decentralized Network",
    BADGE_METRIC_PUBLISHER_SUBGRAPHS_DEPLOYED,
    BigInt.fromI32(10),
    BigInt.fromI32(3),
    "QmUobcPJ2PBg5UxnmQ9BP4n19EXQgW6SG7ugoS6wRQVP8u"
  );
}
