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

export function oneDay(): BigInt {
  return BigInt.fromI32(60 * 60 * 24);
}

export const PROTOCOL_NAME_THE_GRAPH = "The Graph";
export const PROTOCOL_URL_HANDLE_THE_GRAPH = "the-graph";

export const BADGE_NAME_FIRST_TO_CLOSE = "First To Close";
export const BADGE_DESCRIPTION_FIRST_TO_CLOSE =
  "Awarded to indexers who are first to close an allocation for a subgraph";
export const BADGE_URL_HANDLE_FIRST_TO_CLOSE = "first-to-close";
export const BADGE_VOTE_WEIGHT_FIRST_TO_CLOSE = "1.0";

export const BADGE_NAME_28_EPOCHS_LATER = "28 Epochs Later";
export const BADGE_DESCRIPTION_28_EPOCHS_LATER =
  "Awarded to indexers who close their allocations every 28 epochs or fewer";
export const BADGE_URL_HANDLE_28_EPOCHS_LATER = "28-epochs-later";
export const BADGE_VOTE_WEIGHT_28_EPOCHS_LATER = "1.0";

export const BADGE_NAME_NEVER_SLASHED = "Never Slashed";
export const BADGE_DESCRIPTION_NEVER_SLASHED =
  "Awarded to indexers who are don't get slashed during a era";
export const BADGE_URL_HANDLE_NEVER_SLASHED = "never-slashed";
export const BADGE_VOTE_WEIGHT_NEVER_SLASHED = "1.0";

export const BADGE_NAME_DELEGATION_NATION = "Delegation Nation";
export const BADGE_DESCRIPTION_DELEGATION_NATION =
  "Awarded to delegators who delegate to 3 or more indexers during any epoch";
export const BADGE_URL_HANDLE_DELEGATION_NATION = "delegation-nation";
export const BADGE_VOTE_WEIGHT_DELEGATION_NATION = "1.0";

export const BADGE_NAME_DELEGATION_STREAK = "Delegation Streak";
export const BADGE_DESCRIPTION_DELEGATION_STREAK =
  "Awarded to delegators who delegate > 0 for > 0 consecutive blocks";
export const BADGE_URL_HANDLE_DELEGATION_STREAK = "delegation-streak";
export const BADGE_VOTE_WEIGHT_DELEGATION_STREAK = "1.0";
