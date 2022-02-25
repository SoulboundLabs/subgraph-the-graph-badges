import { BigInt } from "@graphprotocol/graph-ts";
import { createOrLoadBadgeDefinition } from "../Emblem/emblemModels";
import {
  PROTOCOL_ROLE_CURATOR,
  PROTOCOL_ROLE_DELEGATOR,
  PROTOCOL_ROLE_DEVELOPER,
  PROTOCOL_ROLE_INDEXER,
} from "../helpers/constants";
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
    "QmQpJMDSuDsWHuVLetFLPMetKf9k8hHfTsopteuzkHDQ8z",
    PROTOCOL_ROLE_INDEXER
  );
  createOrLoadBadgeDefinition(
    "Indexing Diversity II",
    "Index 5 Subgraphs",
    BADGE_METRIC_INDEXER_SUBGRAPHS_INDEXED,
    BigInt.fromI32(5),
    BigInt.fromI32(4),
    "QmQbveFF8J5tT8yR9vqp87CG5z2E44i489mpR3p7Ff3AA5",
    PROTOCOL_ROLE_INDEXER
  );
  createOrLoadBadgeDefinition(
    "Indexing Diversity III",
    "Index 15 Subgraphs",
    BADGE_METRIC_INDEXER_SUBGRAPHS_INDEXED,
    BigInt.fromI32(15),
    BigInt.fromI32(7),
    "QmeEwuH4ZE9E8FTb6jLJw7QHiRd6kY3CkMP3Uw5rbWJKzk",
    PROTOCOL_ROLE_INDEXER
  );

  createOrLoadBadgeDefinition(
    "Query Collector I",
    "Collect 1k GRT in query fees",
    BADGE_METRIC_INDEXER_QUERY_FEES_COLLECTED,
    BigInt.fromString("1000000000000000000000"),
    BigInt.fromI32(1),
    "QmWoj4di4bukC81PNCeSRSuQqEhLoo75XHANvuz7n4ejPe",
    PROTOCOL_ROLE_INDEXER
  );
  createOrLoadBadgeDefinition(
    "Query Collector II",
    "Collect 10k GRT in query fees",
    BADGE_METRIC_INDEXER_QUERY_FEES_COLLECTED,
    BigInt.fromString("10000000000000000000000"),
    BigInt.fromI32(4),
    "QmdcHm17vat66zXFkjjACZWcRWpik7DVE7WZTkdjQtaZpu",
    PROTOCOL_ROLE_INDEXER
  );

  createOrLoadBadgeDefinition(
    "Query Collector III",
    "Collect 25k GRT in query fees",
    BADGE_METRIC_INDEXER_QUERY_FEES_COLLECTED,
    BigInt.fromString("25000000000000000000000"),
    BigInt.fromI32(7),
    "QmNN7exESvL8jcoyVbroFf7vkFUa697jenR8E7fX3nyRTa",
    PROTOCOL_ROLE_INDEXER
  );

  createOrLoadBadgeDefinition(
    "Delegation Received I",
    "Receive GRT from 1 Delegator",
    BADGE_METRIC_INDEXER_DELEGATOR_COUNT,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmZjYNzhdMagUWgmkw4ib17Vc5BP4JkHevY11AsP138uop",
    PROTOCOL_ROLE_INDEXER
  );
  createOrLoadBadgeDefinition(
    "Delegation Received II",
    "Receive GRT from 25 Delegators",
    BADGE_METRIC_INDEXER_DELEGATOR_COUNT,
    BigInt.fromI32(25),
    BigInt.fromI32(4),
    "QmbC16nssC6GcCtMXv9RidCwEQoMsQQYquJtyRa9wM68iy",
    PROTOCOL_ROLE_INDEXER
  );
  createOrLoadBadgeDefinition(
    "Delegation Received III",
    "Receive GRT from 100 Delegators",
    BADGE_METRIC_INDEXER_DELEGATOR_COUNT,
    BigInt.fromI32(100),
    BigInt.fromI32(7),
    "QmcDnovgqSpgs6nrJanx2nFx9VJ9bYKZQDBu1oiapDdKQm",
    PROTOCOL_ROLE_INDEXER
  );

  //////// DELEGATOR BADGES ////////

  createOrLoadBadgeDefinition(
    "Delegation Diversity I",
    "Delegate to 1 Indexer",
    BADGE_METRIC_DELEGATOR_INDEXERS,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmX4vJh4TeBTiUufNUzSV43kgC411wphKhuFhspqLPypR9",
    PROTOCOL_ROLE_DELEGATOR
  );
  createOrLoadBadgeDefinition(
    "Delegation Diversity II",
    "Delegate to 3 Indexers",
    BADGE_METRIC_DELEGATOR_INDEXERS,
    BigInt.fromI32(3),
    BigInt.fromI32(4),
    "QmZGUNuUF4iwZ6KfGeCk7EzX9iUoMu3D9LkioyUB5DVhLs",
    PROTOCOL_ROLE_DELEGATOR
  );
  createOrLoadBadgeDefinition(
    "Delegation Diversity III",
    "Delegate to 10 Indexer",
    BADGE_METRIC_DELEGATOR_INDEXERS,
    BigInt.fromI32(10),
    BigInt.fromI32(7),
    "QmeUG7igNjqy8jnbiJGCvxt5cQns7evUTRmfbvDTrdn8jm",
    PROTOCOL_ROLE_DELEGATOR
  );

  //////// CURATOR BADGES ////////

  createOrLoadBadgeDefinition(
    "Signal Diversity I",
    "Signal 1 Subgraph",
    BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmXoY4EnWEQHzxZagkPPKQU5kzgASPET5UN836yWDX3kxo",
    PROTOCOL_ROLE_CURATOR
  );
  createOrLoadBadgeDefinition(
    "Signal Diversity II",
    "Signal 5 Subgraphs",
    BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
    BigInt.fromI32(5),
    BigInt.fromI32(4),
    "QmYphgzNZpvMrGtt67PheAbFXUgEs1Guu3wFvg1zmzuvBe",
    PROTOCOL_ROLE_CURATOR
  );
  createOrLoadBadgeDefinition(
    "Signal Diversity III",
    "Signal 10 Subgraphs",
    BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
    BigInt.fromI32(10),
    BigInt.fromI32(7),
    "QmNq8oMC7erM6gNWFk5qV2c77fwsN3YZiajJLUyqf7sPV1",
    PROTOCOL_ROLE_CURATOR
  );

  //////// DEVELOPER BADGES ////////

  createOrLoadBadgeDefinition(
    "Signal Acquired I",
    "Receive 1k GRT in Curator Signal on your Subgraphs",
    BADGE_METRIC_PUBLISHER_SIGNAL_ATTRACTED,
    BigInt.fromString("1000000000000000000000"),
    BigInt.fromI32(1),
    "QmPLjA6zCqKyqa9465Qb7DFoMgWL8aj4CgN3fvDsQR53uy",
    PROTOCOL_ROLE_DEVELOPER
  );
  createOrLoadBadgeDefinition(
    "Signal Acquired II",
    "Receive 10k GRT in Curator Signal on your Subgraphs",
    BADGE_METRIC_PUBLISHER_SIGNAL_ATTRACTED,
    BigInt.fromString("10000000000000000000000"),
    BigInt.fromI32(4),
    "QmeE8mwVvsxSZ8hieW9Voeus3cknxavJvkWYJRqGGefe9v",
    PROTOCOL_ROLE_DEVELOPER
  );
  createOrLoadBadgeDefinition(
    "Signal Acquired III",
    "Receive 30k GRT in Curator Signal on your Subgraphs",
    BADGE_METRIC_PUBLISHER_SIGNAL_ATTRACTED,
    BigInt.fromString("30000000000000000000000"),
    BigInt.fromI32(7),
    "QmaWXCmacr7MmGhpfovELYRciX7t1BRjiECzXkmMu3Cyaf",
    PROTOCOL_ROLE_DEVELOPER
  );

  createOrLoadBadgeDefinition(
    "Subgraph Deployed I",
    "Deploy 1 Subgraph to the Decentralized Network",
    BADGE_METRIC_PUBLISHER_SUBGRAPHS_DEPLOYED,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmXYG9s8LhwYLwZxSHxYaS8meCjDAJxr1PSiSn8JYfDjFS",
    PROTOCOL_ROLE_DEVELOPER
  );
  createOrLoadBadgeDefinition(
    "Subgraph Deployed II",
    "Deploy 3 Subgraphs to the Decentralized Network",
    BADGE_METRIC_PUBLISHER_SUBGRAPHS_DEPLOYED,
    BigInt.fromI32(3),
    BigInt.fromI32(4),
    "QmRXK5HfunTFzjPb9p7ffq9DBoBKMNLQBEwX3v8BZWoUab",
    PROTOCOL_ROLE_DEVELOPER
  );
  createOrLoadBadgeDefinition(
    "Subgraph Deployed III",
    "Deploy 10 Subgraphs to the Decentralized Network",
    BADGE_METRIC_PUBLISHER_SUBGRAPHS_DEPLOYED,
    BigInt.fromI32(10),
    BigInt.fromI32(7),
    "QmesqMvtp86duLQbfFX5rmYrqHq6GnQ8sNMr9gw7waHPJZ",
    PROTOCOL_ROLE_DEVELOPER
  );
}
