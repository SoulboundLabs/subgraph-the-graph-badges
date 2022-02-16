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
    "Alchemist I",
    "Index 1 Subgraph",
    BADGE_METRIC_INDEXER_SUBGRAPHS_INDEXED,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmWTiYmoucGmr6EpPweimcZYvfXyfhsRRxxFthCFKrEktN"
  );
  createOrLoadBadgeDefinition(
    "Alchemist II",
    "Index 5 Subgraphs",
    BADGE_METRIC_INDEXER_SUBGRAPHS_INDEXED,
    BigInt.fromI32(5),
    BigInt.fromI32(2),
    "QmQbveFF8J5tT8yR9vqp87CG5z2E44i489mpR3p7Ff3AA5"
  );
  createOrLoadBadgeDefinition(
    "Alchemist III",
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
    "Allegiance I",
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
    "Guardian I",
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
    "QmezkgQA82CFRW3tXEKpyrpt7h1hrMF4dxCSL2ouMJbFZZ"
  );
  createOrLoadBadgeDefinition(
    "Guardian III",
    "Delegate to 10 Indexer",
    BADGE_METRIC_DELEGATOR_INDEXERS,
    BigInt.fromI32(10),
    BigInt.fromI32(3),
    "QmQh8Yj4yPskDDnoSYPePndHZtiRcpU1Hv9ZKhDozsibZ4"
  );

  //////// CURATOR BADGES ////////

  createOrLoadBadgeDefinition(
    "Pathfinder I",
    "Signal 1 Subgraph",
    BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
    BigInt.fromI32(1),
    BigInt.fromI32(1),
    "QmXoY4EnWEQHzxZagkPPKQU5kzgASPET5UN836yWDX3kxo"
  );
  createOrLoadBadgeDefinition(
    "Pathfinder II",
    "Signal 5 Subgraphs",
    BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
    BigInt.fromI32(5),
    BigInt.fromI32(2),
    "QmPPD2s53kt11wW9KLhmVrYXHSdLtH2H23NhYAYUsALJ3Y"
  );
  createOrLoadBadgeDefinition(
    "Pathfinder III",
    "Signal 10 Subgraphs",
    BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
    BigInt.fromI32(10),
    BigInt.fromI32(3),
    "QmenzU7AGTNAvdfzjShCt1ZBd9WaEm41zLGF1JmW7hs4k4"
  );

  //////// DEVELOPER BADGES ////////

  createOrLoadBadgeDefinition(
    "Beacon I",
    "Receive 1k GRT in Curator Signal on your Subgraphs",
    BADGE_METRIC_PUBLISHER_SIGNAL_ATTRACTED,
    BigInt.fromString("1000000000000000000000"),
    BigInt.fromI32(1),
    "QmWcTEXphkxmQQgcKPiKEBdnYTLEmj7y8vAbcMaVqkpry7"
  );
  createOrLoadBadgeDefinition(
    "Beacon II",
    "Receive 10k GRT in Curator Signal on your Subgraphs",
    BADGE_METRIC_PUBLISHER_SIGNAL_ATTRACTED,
    BigInt.fromString("10000000000000000000000"),
    BigInt.fromI32(2),
    "QmWcTEXphkxmQQgcKPiKEBdnYTLEmj7y8vAbcMaVqkpry7"
  );
  createOrLoadBadgeDefinition(
    "Beacon III",
    "Receive 30k GRT in Curator Signal on your Subgraphs",
    BADGE_METRIC_PUBLISHER_SIGNAL_ATTRACTED,
    BigInt.fromString("30000000000000000000000"),
    BigInt.fromI32(3),
    "QmWcTEXphkxmQQgcKPiKEBdnYTLEmj7y8vAbcMaVqkpry7"
  );

  createOrLoadBadgeDefinition(
    "Subgraph Smith I",
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
