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

export const BADGE_NAME_FIRST_TO_CLOSE = "First To Close";
export const BADGE_DESCRIPTION_FIRST_TO_CLOSE = "Awarded to indexers who are first to close an allocation for a subgraph";
export const BADGE_TAGLINE_FIRST_TO_CLOSE = "The early indexer gets the worm";

export const BADGE_NAME_28_EPOCHS_LATER = "28 Epochs Later";
export const BADGE_DESCRIPTION_28_EPOCHS_LATER = "Awarded to indexers who close their allocations every 28 epochs or fewer";
export const BADGE_TAGLINE_28_EPOCHS_LATER = "Kid, you're only as good as your last closed allocation";

export const BADGE_NAME_NEVER_SLASHED = "Never Slashed";
export const BADGE_DESCRIPTION_NEVER_SLASHED = "Awarded to indexers who are don't get slashed during a era";
export const BADGE_TAGLINE_NEVER_SLASHED = "Freddy Kreuger would be proud";

export const BADGE_NAME_DELEGATION_NATION = "Delegation Nation";
export const BADGE_DESCRIPTION_DELEGATION_NATION = "Awarded to delegators who delegate to 3 or more indexers during any epoch";
export const BADGE_TAGLINE_DELEGATION_NATION = "A seven nation army couldn't hold me back";

export const BADGE_NAME_DELEGATION_STREAK = "Delegation Streak";
export const BADGE_DESCRIPTION_DELEGATION_STREAK = "Awarded to delegators who delegate > 0 for > 0 consecutive blocks";
export const BADGE_TAGLINE_DELEGATION_STREAK = "Eyes on the prize";

