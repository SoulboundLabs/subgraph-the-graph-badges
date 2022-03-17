import { BigInt } from "@graphprotocol/graph-ts";
import { createBadgeDefinition } from "../Emblem/emblemModels";
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

  createBadgeDefinition(
    "Indexing Diversity I",
    "Index 1 Subgraph",
    0,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmQpJMDSuDsWHuVLetFLPMetKf9k8hHfTsopteuzkHDQ8z"
  );
  createBadgeDefinition(
    "Indexing Diversity II",
    "Index 5 Subgraphs",
    0,
    BigInt.fromI32(5),
    BigInt.fromI32(4),
    "QmQbveFF8J5tT8yR9vqp87CG5z2E44i489mpR3p7Ff3AA5"
  );
  createBadgeDefinition(
    "Indexing Diversity III",
    "Index 15 Subgraphs",
    0,
    BigInt.fromI32(15),
    BigInt.fromI32(7),
    "QmeEwuH4ZE9E8FTb6jLJw7QHiRd6kY3CkMP3Uw5rbWJKzk"
  );

  createBadgeDefinition(
    "Query Collector I",
    "Collect 1k GRT in query fees",
    1,
    BigInt.fromString("1000000000000000000000"),
    BigInt.fromI32(1),
    "QmWoj4di4bukC81PNCeSRSuQqEhLoo75XHANvuz7n4ejPe"
  );
  createBadgeDefinition(
    "Query Collector II",
    "Collect 10k GRT in query fees",
    1,
    BigInt.fromString("10000000000000000000000"),
    BigInt.fromI32(4),
    "QmdcHm17vat66zXFkjjACZWcRWpik7DVE7WZTkdjQtaZpu"
  );

  createBadgeDefinition(
    "Query Collector III",
    "Collect 25k GRT in query fees",
    1,
    BigInt.fromString("25000000000000000000000"),
    BigInt.fromI32(7),
    "QmNN7exESvL8jcoyVbroFf7vkFUa697jenR8E7fX3nyRTa"
  );

  createBadgeDefinition(
    "Delegation Received I",
    "Receive GRT from 1 Delegator",
    3,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmZjYNzhdMagUWgmkw4ib17Vc5BP4JkHevY11AsP138uop"
  );
  createBadgeDefinition(
    "Delegation Received II",
    "Receive GRT from 25 Delegators",
    3,
    BigInt.fromI32(25),
    BigInt.fromI32(4),
    "QmbC16nssC6GcCtMXv9RidCwEQoMsQQYquJtyRa9wM68iy"
  );
  createBadgeDefinition(
    "Delegation Received III",
    "Receive GRT from 100 Delegators",
    3,
    BigInt.fromI32(100),
    BigInt.fromI32(7),
    "QmcDnovgqSpgs6nrJanx2nFx9VJ9bYKZQDBu1oiapDdKQm"
  );

  //////// DELEGATOR BADGES ////////

  createBadgeDefinition(
    "Delegation Diversity I",
    "Delegate to 1 Indexer",
    4,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmX4vJh4TeBTiUufNUzSV43kgC411wphKhuFhspqLPypR9"
  );
  createBadgeDefinition(
    "Delegation Diversity II",
    "Delegate to 3 Indexers",
    4,
    BigInt.fromI32(3),
    BigInt.fromI32(4),
    "QmZGUNuUF4iwZ6KfGeCk7EzX9iUoMu3D9LkioyUB5DVhLs"
  );
  createBadgeDefinition(
    "Delegation Diversity III",
    "Delegate to 10 Indexer",
    4,
    BigInt.fromI32(10),
    BigInt.fromI32(7),
    "QmeUG7igNjqy8jnbiJGCvxt5cQns7evUTRmfbvDTrdn8jm"
  );

  //////// CURATOR BADGES ////////

  createBadgeDefinition(
    "Signal Diversity I",
    "Signal 1 Subgraph",
    5,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmXoY4EnWEQHzxZagkPPKQU5kzgASPET5UN836yWDX3kxo"
  );
  createBadgeDefinition(
    "Signal Diversity II",
    "Signal 5 Subgraphs",
    5,
    BigInt.fromI32(5),
    BigInt.fromI32(4),
    "QmYphgzNZpvMrGtt67PheAbFXUgEs1Guu3wFvg1zmzuvBe"
  );
  createBadgeDefinition(
    "Signal Diversity III",
    "Signal 10 Subgraphs",
    5,
    BigInt.fromI32(10),
    BigInt.fromI32(7),
    "QmNq8oMC7erM6gNWFk5qV2c77fwsN3YZiajJLUyqf7sPV1"
  );

  //////// SUBGRAPH_DEVELOPER BADGES ////////

  createBadgeDefinition(
    "Signal Acquired I",
    "Receive 1k GRT in Curator Signal on your Subgraphs",
    8,
    BigInt.fromString("1000000000000000000000"),
    BigInt.fromI32(1),
    "QmPLjA6zCqKyqa9465Qb7DFoMgWL8aj4CgN3fvDsQR53uy"
  );
  createBadgeDefinition(
    "Signal Acquired II",
    "Receive 10k GRT in Curator Signal on your Subgraphs",
    8,
    BigInt.fromString("10000000000000000000000"),
    BigInt.fromI32(4),
    "QmeE8mwVvsxSZ8hieW9Voeus3cknxavJvkWYJRqGGefe9v"
  );
  createBadgeDefinition(
    "Signal Acquired III",
    "Receive 30k GRT in Curator Signal on your Subgraphs",
    8,
    BigInt.fromString("30000000000000000000000"),
    BigInt.fromI32(7),
    "QmaWXCmacr7MmGhpfovELYRciX7t1BRjiECzXkmMu3Cyaf"
  );

  createBadgeDefinition(
    "Subgraph Deployed I",
    "Deploy 1 Subgraph to the Decentralized Network",
    9,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmXYG9s8LhwYLwZxSHxYaS8meCjDAJxr1PSiSn8JYfDjFS"
  );
  createBadgeDefinition(
    "Subgraph Deployed II",
    "Deploy 3 Subgraphs to the Decentralized Network",
    9,
    BigInt.fromI32(3),
    BigInt.fromI32(4),
    "QmRXK5HfunTFzjPb9p7ffq9DBoBKMNLQBEwX3v8BZWoUab"
  );
  createBadgeDefinition(
    "Subgraph Deployed III",
    "Deploy 10 Subgraphs to the Decentralized Network",
    9,
    BigInt.fromI32(10),
    BigInt.fromI32(7),
    "QmesqMvtp86duLQbfFX5rmYrqHq6GnQ8sNMr9gw7waHPJZ"
  );
}
