import { BigInt } from "@graphprotocol/graph-ts";
import { createSoulboundBadgeDefinition } from "../Emblem/emblemModels";

// In order for retroactive soulboundBadge drops to cover the entire subgraph
// history, this function needs to be called from the first event.
export function generateGenesisSoulboundBadgeDefinitions(): void {
  //////// INDEXER BADGES ////////

  createSoulboundBadgeDefinition(
    "Indexing Diversity I",
    "Index 1 Subgraph",
    0,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmQpJMDSuDsWHuVLetFLPMetKf9k8hHfTsopteuzkHDQ8z"
  );
  createSoulboundBadgeDefinition(
    "Indexing Diversity II",
    "Index 5 Subgraphs",
    0,
    BigInt.fromI32(5),
    BigInt.fromI32(4),
    "QmQbveFF8J5tT8yR9vqp87CG5z2E44i489mpR3p7Ff3AA5"
  );
  createSoulboundBadgeDefinition(
    "Indexing Diversity III",
    "Index 15 Subgraphs",
    0,
    BigInt.fromI32(15),
    BigInt.fromI32(7),
    "QmeEwuH4ZE9E8FTb6jLJw7QHiRd6kY3CkMP3Uw5rbWJKzk"
  );

  createSoulboundBadgeDefinition(
    "Query Collector I",
    "Collect 1k GRT in query fees",
    1,
    BigInt.fromString("1000000000000000000000"),
    BigInt.fromI32(1),
    "QmWoj4di4bukC81PNCeSRSuQqEhLoo75XHANvuz7n4ejPe"
  );
  createSoulboundBadgeDefinition(
    "Query Collector II",
    "Collect 10k GRT in query fees",
    1,
    BigInt.fromString("10000000000000000000000"),
    BigInt.fromI32(4),
    "QmdcHm17vat66zXFkjjACZWcRWpik7DVE7WZTkdjQtaZpu"
  );

  createSoulboundBadgeDefinition(
    "Query Collector III",
    "Collect 25k GRT in query fees",
    1,
    BigInt.fromString("25000000000000000000000"),
    BigInt.fromI32(7),
    "QmNN7exESvL8jcoyVbroFf7vkFUa697jenR8E7fX3nyRTa"
  );

  createSoulboundBadgeDefinition(
    "Delegation Received I",
    "Receive GRT from 1 Delegator",
    3,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmZjYNzhdMagUWgmkw4ib17Vc5BP4JkHevY11AsP138uop"
  );
  createSoulboundBadgeDefinition(
    "Delegation Received II",
    "Receive GRT from 25 Delegators",
    3,
    BigInt.fromI32(25),
    BigInt.fromI32(4),
    "QmbC16nssC6GcCtMXv9RidCwEQoMsQQYquJtyRa9wM68iy"
  );
  createSoulboundBadgeDefinition(
    "Delegation Received III",
    "Receive GRT from 100 Delegators",
    3,
    BigInt.fromI32(100),
    BigInt.fromI32(7),
    "QmcDnovgqSpgs6nrJanx2nFx9VJ9bYKZQDBu1oiapDdKQm"
  );

  //////// DELEGATOR BADGES ////////

  createSoulboundBadgeDefinition(
    "Delegation Diversity I",
    "Delegate to 1 Indexer",
    4,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmX4vJh4TeBTiUufNUzSV43kgC411wphKhuFhspqLPypR9"
  );
  createSoulboundBadgeDefinition(
    "Delegation Diversity II",
    "Delegate to 3 Indexers",
    4,
    BigInt.fromI32(3),
    BigInt.fromI32(4),
    "QmZGUNuUF4iwZ6KfGeCk7EzX9iUoMu3D9LkioyUB5DVhLs"
  );
  createSoulboundBadgeDefinition(
    "Delegation Diversity III",
    "Delegate to 10 Indexer",
    4,
    BigInt.fromI32(10),
    BigInt.fromI32(7),
    "QmeUG7igNjqy8jnbiJGCvxt5cQns7evUTRmfbvDTrdn8jm"
  );

  //////// CURATOR BADGES ////////

  createSoulboundBadgeDefinition(
    "Signal Diversity I",
    "Signal 1 Subgraph",
    5,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmXoY4EnWEQHzxZagkPPKQU5kzgASPET5UN836yWDX3kxo"
  );
  createSoulboundBadgeDefinition(
    "Signal Diversity II",
    "Signal 5 Subgraphs",
    5,
    BigInt.fromI32(5),
    BigInt.fromI32(4),
    "QmYphgzNZpvMrGtt67PheAbFXUgEs1Guu3wFvg1zmzuvBe"
  );
  createSoulboundBadgeDefinition(
    "Signal Diversity III",
    "Signal 10 Subgraphs",
    5,
    BigInt.fromI32(10),
    BigInt.fromI32(7),
    "QmNq8oMC7erM6gNWFk5qV2c77fwsN3YZiajJLUyqf7sPV1"
  );

  //////// SUBGRAPH_DEVELOPER BADGES ////////

  createSoulboundBadgeDefinition(
    "Signal Acquired I",
    "Receive 1k GRT in Curator Signal on your Subgraphs",
    8,
    BigInt.fromString("1000000000000000000000"),
    BigInt.fromI32(1),
    "QmPLjA6zCqKyqa9465Qb7DFoMgWL8aj4CgN3fvDsQR53uy"
  );
  createSoulboundBadgeDefinition(
    "Signal Acquired II",
    "Receive 10k GRT in Curator Signal on your Subgraphs",
    8,
    BigInt.fromString("10000000000000000000000"),
    BigInt.fromI32(4),
    "QmeE8mwVvsxSZ8hieW9Voeus3cknxavJvkWYJRqGGefe9v"
  );
  createSoulboundBadgeDefinition(
    "Signal Acquired III",
    "Receive 30k GRT in Curator Signal on your Subgraphs",
    8,
    BigInt.fromString("30000000000000000000000"),
    BigInt.fromI32(7),
    "QmaWXCmacr7MmGhpfovELYRciX7t1BRjiECzXkmMu3Cyaf"
  );

  createSoulboundBadgeDefinition(
    "Subgraph Deployed I",
    "Deploy 1 Subgraph to the Decentralized Network",
    9,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmXYG9s8LhwYLwZxSHxYaS8meCjDAJxr1PSiSn8JYfDjFS"
  );
  createSoulboundBadgeDefinition(
    "Subgraph Deployed II",
    "Deploy 3 Subgraphs to the Decentralized Network",
    9,
    BigInt.fromI32(3),
    BigInt.fromI32(4),
    "QmRXK5HfunTFzjPb9p7ffq9DBoBKMNLQBEwX3v8BZWoUab"
  );
  createSoulboundBadgeDefinition(
    "Subgraph Deployed III",
    "Deploy 10 Subgraphs to the Decentralized Network",
    9,
    BigInt.fromI32(10),
    BigInt.fromI32(7),
    "QmesqMvtp86duLQbfFX5rmYrqHq6GnQ8sNMr9gw7waHPJZ"
  );
}
