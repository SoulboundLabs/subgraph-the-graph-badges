import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export function subgraphName(): string {
  return "TheGraphBadges";
}

export function badgeOverviewId(): string {
  return "BadgeOverview"; // Singleton ID for BadgeStats entity
}

export function zeroBD(): BigDecimal {
  return BigDecimal.fromString("0");
}

export function oneBD(): BigDecimal {
  return BigDecimal.fromString("1");
}

export function sixteenBD(): BigDecimal {
  return BigDecimal.fromString("16");
}

export function protocolGenesis(): BigInt {
  return BigInt.fromString("1607844057"); // Timestamp for Ethereum Block #11446786
}

export function zeroBI(): BigInt {
  return BigInt.fromI32(0);
}

export function oneBI(): BigInt {
  return BigInt.fromI32(1);
}

export function negOneBI(): BigInt {
  return BigInt.fromI32(-1);
}

export function oneDay(): BigInt {
  return BigInt.fromI32(60 * 60 * 24);
}

export function minimumDelegationStreak(): BigInt {
  return BigInt.fromI32(100000); // measured in blocks
}

export const PROTOCOL_NAME_THE_GRAPH = "The Graph";

export const PROTOCOL_ROLE_INDEXER = "Indexer";
export const PROTOCOL_ROLE_DELEGATOR = "Delegator";
export const PROTOCOL_ROLE_CURATOR = "Curator";
export const PROTOCOL_ROLE_SUBGRAPH_DEVELOPER = "Subgraph Developer";

/////////// BADGEAWARD METADATA ENUMS //////////////

export const BADGE_AWARD_METADATA_NAME_INDEXER = "INDEXER";
export const BADGE_AWARD_METADATA_NAME_DELEGATOR = "DELEGATOR";
export const BADGE_AWARD_METADATA_NAME_CURATOR = "CURATOR";
export const BADGE_AWARD_METADATA_NAME_DEVELOPER = "DEVELOPER";
export const BADGE_AWARD_METADATA_NAME_SUBGRAPH = "SUBGRAPH";
export const BADGE_AWARD_METADATA_NAME_SUBGRAPH_DEPLOYMENT =
  "SUBGRAPH_DEPLOYMENT";
export const BADGE_AWARD_METADATA_NAME_TOKENS = "TOKENS";

/////////// BADGEMETRIC ENUMS //////////////

export const BADGE_METRIC_INDEXER_SUBGRAPHS_INDEXED =
  "INDEXER_SUBGRAPHS_INDEXED";
export const BADGE_METRIC_INDEXER_QUERY_FEES_COLLECTED =
  "INDEXER_QUERY_FEES_COLLECTED";
export const BADGE_METRIC_INDEXER_ALLOCATIONS_OPENED =
  "INDEXER_ALLOCATIONS_OPENED";
export const BADGE_METRIC_INDEXER_DELEGATOR_COUNT = "INDEXER_DELEGATOR_COUNT";
export const BADGE_METRIC_DELEGATOR_INDEXERS = "DELEGATOR_INDEXERS";
export const BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED =
  "CURATOR_SUBGRAPHS_SIGNALLED";
export const BADGE_METRIC_CURATOR_HOUSE_ODDS = "CURATOR_HOUSE_ODDS";
export const BADGE_METRIC_CURATOR_APE = "CURATOR_APE";
export const BADGE_METRIC_PUBLISHER_SIGNAL_ATTRACTED =
  "PUBLISHER_SIGNAL_ATTRACTED";
export const BADGE_METRIC_PUBLISHER_SUBGRAPHS_DEPLOYED =
  "PUBLISHER_SUBGRAPHS_DEPLOYED";
export const BADGE_METRIC_USER_BADGES_WON = "BADGE_METRIC_USER_BADGES_WON";
