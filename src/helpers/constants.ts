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

export const AWARDED_AT_TYPE_BLOCK = "Block";
export const AWARDED_AT_TYPE_ERA = "Era";

export const PROTOCOL_NAME_THE_GRAPH = "The Graph";
export const PROTOCOL_URL_HANDLE_THE_GRAPH = "the-graph";
export const PROTOCOL_DESCRIPTION_THE_GRAPH =
  "The Graph is an indexing protocol for querying networks like Ethereum and IPFS. Anyone can build and publish open APIs, called subgraphs, making data easily accessible.";
export const PROTOCOL_WEBSITE_THE_GRAPH = "https://thegraph.com";

export const BADGE_NAME_FIRST_TO_CLOSE = "First To Close";
export const BADGE_DESCRIPTION_FIRST_TO_CLOSE =
  "Awarded to indexers who are first to close an allocation for a subgraph";
export const BADGE_URL_HANDLE_FIRST_TO_CLOSE = "first-to-close";
export const BADGE_VOTE_POWER_FIRST_TO_CLOSE = 1;

export const BADGE_NAME_28_EPOCHS_LATER = "28 Epochs Later";
export const BADGE_DESCRIPTION_28_EPOCHS_LATER =
  "Awarded to indexers who close their allocations every 28 epochs or fewer";
export const BADGE_URL_HANDLE_28_EPOCHS_LATER = "28-epochs-later";
export const BADGE_VOTE_POWER_28_EPOCHS_LATER = 1;
export const BADGE_STREAK_MIN_CLOSES_28_EPOCHS_LATER = 100;

export const BADGE_NAME_NEVER_SLASHED = "Never Slashed";
export const BADGE_DESCRIPTION_NEVER_SLASHED =
  "Awarded to indexers who don't get slashed for at least 30 days";
export const BADGE_URL_HANDLE_NEVER_SLASHED = "never-slashed";
export const BADGE_VOTE_POWER_NEVER_SLASHED = 1;
export const BADGE_STREAK_MIN_DAYS_NEVER_SLASHED = 30;

export const BADGE_NAME_DELEGATION_NATION = "Delegation Nation";
export const BADGE_DESCRIPTION_DELEGATION_NATION =
  "Awarded to delegators who delegate to 3 or more indexers";
export const BADGE_URL_HANDLE_DELEGATION_NATION = "delegation-nation";
export const BADGE_VOTE_POWER_DELEGATION_NATION = 1;

export const BADGE_NAME_DELEGATION_STREAK = "Delegation Streak";
export const BADGE_DESCRIPTION_DELEGATION_STREAK =
  "Awarded to delegators who delegate for at least 30 consecutive days";
export const BADGE_URL_HANDLE_DELEGATION_STREAK = "delegation-streak";
export const BADGE_VOTE_POWER_DELEGATION_STREAK = 1;
export const BADGE_STREAK_MIN_DAYS_DELEGATION_STREAK = 90;

export const BADGE_NAME_PLANET_OF_THE_APED = "Planet Of The Aped";
export const BADGE_DESCRIPTION_PLANET_OF_THE_APED =
  "Awarded to curators who signal within 420 blocks of a subgraph being published";
export const BADGE_URL_HANDLE_PLANET_OF_THE_APED = "planet-of-the-aped";
export const BADGE_VOTE_POWER_PLANET_OF_THE_APED = 1;

export const BADGE_NAME_SUBGRAPH_SHARK = "Subgraph Shark";
export const BADGE_DESCRIPTION_SUBGRAPH_SHARK =
  "Awarded to curators who sell curation shares for a profit";
export const BADGE_URL_HANDLE_SUBGRAPH_SHARK = "subgraph-shark";
export const BADGE_VOTE_POWER_SUBGRAPH_SHARK = 1;

export const BADGE_NAME_SUBGRAPH_DEVELOPER = "Captain Subgraph";
export const BADGE_DESCRIPTION_SUBGRAPH_DEVELOPER =
  "Awarded to developers who publish their first subgraph";
export const BADGE_URL_HANDLE_SUBGRAPH_DEVELOPER = "captain-subgraph";
export const BADGE_VOTE_POWER_SUBGRAPH_DEVELOPER = 1;

export const BADGE_NAME_CURATOR_TRIBE = "Curator Tribe";
export const BADGE_DESCRIPTION_CURATOR_TRIBE = "Awarded to first-time curators";
export const BADGE_URL_HANDLE_CURATOR_TRIBE = "curator-tribe";
export const BADGE_VOTE_POWER_CURATOR_TRIBE = 1;

export const BADGE_NAME_DELEGATION_TRIBE = "Delegation Tribe";
export const BADGE_DESCRIPTION_DELEGATION_TRIBE =
  "Awarded to first-time delegators";
export const BADGE_URL_HANDLE_DELEGATION_TRIBE = "delegation-tribe";
export const BADGE_VOTE_POWER_DELEGATION_TRIBE = 1;
