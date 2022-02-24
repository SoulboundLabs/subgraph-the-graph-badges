import { BigInt } from "@graphprotocol/graph-ts";
import { createOrLoadBadgeDefinition } from "../Emblem/emblemModels";
import {
  BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
  BADGE_METRIC_DELEGATOR_INDEXERS,
  BADGE_METRIC_INDEXER_DELEGATOR_COUNT,
  BADGE_METRIC_INDEXER_QUERY_FEES_COLLECTED,
  BADGE_METRIC_INDEXER_SUBGRAPHS_INDEXED,
  BADGE_METRIC_PUBLISHER_SIGNAL_ATTRACTED,
  BADGE_METRIC_PUBLISHER_SUBGRAPHS_DEPLOYED,
} from "./metrics";

// In order for retroactive badge drops to cover the entire subgraph
// history, this function needs to be called from the first event.
export function generateGenesisBadgeDefinitions(): void {
  //////// INDEXER BADGES ////////

  createOrLoadBadgeDefinition(
    "Indexing Diversity I",
    "Index 1 Subgraph",
    BADGE_METRIC_INDEXER_SUBGRAPHS_INDEXED,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmQpJMDSuDsWHuVLetFLPMetKf9k8hHfTsopteuzkHDQ8z"
  );
  createOrLoadBadgeDefinition(
    "Indexing Diversity II",
    "Index 5 Subgraphs",
    BADGE_METRIC_INDEXER_SUBGRAPHS_INDEXED,
    BigInt.fromI32(5),
    BigInt.fromI32(2),
    "QmQbveFF8J5tT8yR9vqp87CG5z2E44i489mpR3p7Ff3AA5"
  );
  createOrLoadBadgeDefinition(
    "Indexing Diversity III",
    "Index 15 Subgraphs",
    BADGE_METRIC_INDEXER_SUBGRAPHS_INDEXED,
    BigInt.fromI32(15),
    BigInt.fromI32(3),
    "QmeEwuH4ZE9E8FTb6jLJw7QHiRd6kY3CkMP3Uw5rbWJKzk"
  );

  createOrLoadBadgeDefinition(
    "Query Collector I",
    "Collect 1k GRT in query fees",
    BADGE_METRIC_INDEXER_QUERY_FEES_COLLECTED,
    BigInt.fromString("1000000000000000000000"),
    BigInt.fromI32(1),
    "QmWoj4di4bukC81PNCeSRSuQqEhLoo75XHANvuz7n4ejPe"
  );
  createOrLoadBadgeDefinition(
    "Query Collector II",
    "Collect 10k GRT in query fees",
    BADGE_METRIC_INDEXER_QUERY_FEES_COLLECTED,
    BigInt.fromString("10000000000000000000000"),
    BigInt.fromI32(1),
    "QmdcHm17vat66zXFkjjACZWcRWpik7DVE7WZTkdjQtaZpu"
  );

  createOrLoadBadgeDefinition(
    "Query Collector III",
    "Collect 25k GRT in query fees",
    BADGE_METRIC_INDEXER_QUERY_FEES_COLLECTED,
    BigInt.fromString("25000000000000000000000"),
    BigInt.fromI32(1),
    "QmNN7exESvL8jcoyVbroFf7vkFUa697jenR8E7fX3nyRTa"
  );

  createOrLoadBadgeDefinition(
    "Delegation Received I",
    "Receive GRT from 1 Delegator",
    BADGE_METRIC_INDEXER_DELEGATOR_COUNT,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmZjYNzhdMagUWgmkw4ib17Vc5BP4JkHevY11AsP138uop"
  );
  createOrLoadBadgeDefinition(
    "Delegation Received II",
    "Receive GRT from 25 Delegators",
    BADGE_METRIC_INDEXER_DELEGATOR_COUNT,
    BigInt.fromI32(25),
    BigInt.fromI32(2),
    "QmbC16nssC6GcCtMXv9RidCwEQoMsQQYquJtyRa9wM68iy"
  );
  createOrLoadBadgeDefinition(
    "Delegation Received III",
    "Receive GRT from 100 Delegators",
    BADGE_METRIC_INDEXER_DELEGATOR_COUNT,
    BigInt.fromI32(100),
    BigInt.fromI32(3),
    "QmcDnovgqSpgs6nrJanx2nFx9VJ9bYKZQDBu1oiapDdKQm"
  );

  //////// DELEGATOR BADGES ////////

  createOrLoadBadgeDefinition(
    "Delegation Diversity I",
    "Delegate to 1 Indexer",
    BADGE_METRIC_DELEGATOR_INDEXERS,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmX4vJh4TeBTiUufNUzSV43kgC411wphKhuFhspqLPypR9"
  );
  createOrLoadBadgeDefinition(
    "Delegation Diversity II",
    "Delegate to 3 Indexers",
    BADGE_METRIC_DELEGATOR_INDEXERS,
    BigInt.fromI32(3),
    BigInt.fromI32(2),
    "QmZGUNuUF4iwZ6KfGeCk7EzX9iUoMu3D9LkioyUB5DVhLs"
  );
  createOrLoadBadgeDefinition(
    "Delegation Diversity III",
    "Delegate to 10 Indexer",
    BADGE_METRIC_DELEGATOR_INDEXERS,
    BigInt.fromI32(10),
    BigInt.fromI32(3),
    "QmeUG7igNjqy8jnbiJGCvxt5cQns7evUTRmfbvDTrdn8jm"
  );

  //////// CURATOR BADGES ////////

  createOrLoadBadgeDefinition(
    "Signal Diversity I",
    "Signal 1 Subgraph",
    BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmXoY4EnWEQHzxZagkPPKQU5kzgASPET5UN836yWDX3kxo"
  );
  createOrLoadBadgeDefinition(
    "Signal Diversity II",
    "Signal 5 Subgraphs",
    BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
    BigInt.fromI32(5),
    BigInt.fromI32(2),
    "QmYphgzNZpvMrGtt67PheAbFXUgEs1Guu3wFvg1zmzuvBe"
  );
  createOrLoadBadgeDefinition(
    "Signal Diversity III",
    "Signal 10 Subgraphs",
    BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
    BigInt.fromI32(10),
    BigInt.fromI32(3),
    "QmNq8oMC7erM6gNWFk5qV2c77fwsN3YZiajJLUyqf7sPV1"
  );

  //////// DEVELOPER BADGES ////////

  createOrLoadBadgeDefinition(
    "Signal Acquired I",
    "Receive 1k GRT in Curator Signal on your Subgraphs",
    BADGE_METRIC_PUBLISHER_SIGNAL_ATTRACTED,
    BigInt.fromString("1000000000000000000000"),
    BigInt.fromI32(1),
    "QmeE8mwVvsxSZ8hieW9Voeus3cknxavJvkWYJRqGGefe9v"
  );
  createOrLoadBadgeDefinition(
    "Signal Acquired II",
    "Receive 10k GRT in Curator Signal on your Subgraphs",
    BADGE_METRIC_PUBLISHER_SIGNAL_ATTRACTED,
    BigInt.fromString("10000000000000000000000"),
    BigInt.fromI32(2),
    "QmeE8mwVvsxSZ8hieW9Voeus3cknxavJvkWYJRqGGefe9v"
  );
  createOrLoadBadgeDefinition(
    "Signal Acquired III",
    "Receive 30k GRT in Curator Signal on your Subgraphs",
    BADGE_METRIC_PUBLISHER_SIGNAL_ATTRACTED,
    BigInt.fromString("30000000000000000000000"),
    BigInt.fromI32(3),
    "QmaWXCmacr7MmGhpfovELYRciX7t1BRjiECzXkmMu3Cyaf"
  );

  createOrLoadBadgeDefinition(
    "Subgraph Deployed I",
    "Deploy 1 Subgraph to the Decentralized Network",
    BADGE_METRIC_PUBLISHER_SUBGRAPHS_DEPLOYED,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmXYG9s8LhwYLwZxSHxYaS8meCjDAJxr1PSiSn8JYfDjFS"
  );
  createOrLoadBadgeDefinition(
    "Subgraph Deployed II",
    "Deploy 3 Subgraphs to the Decentralized Network",
    BADGE_METRIC_PUBLISHER_SUBGRAPHS_DEPLOYED,
    BigInt.fromI32(3),
    BigInt.fromI32(1),
    "QmRXK5HfunTFzjPb9p7ffq9DBoBKMNLQBEwX3v8BZWoUab"
  );
  createOrLoadBadgeDefinition(
    "Subgraph Deployed III",
    "Deploy 10 Subgraphs to the Decentralized Network",
    BADGE_METRIC_PUBLISHER_SUBGRAPHS_DEPLOYED,
    BigInt.fromI32(10),
    BigInt.fromI32(3),
    "QmesqMvtp86duLQbfFX5rmYrqHq6GnQ8sNMr9gw7waHPJZ"
  );
}
