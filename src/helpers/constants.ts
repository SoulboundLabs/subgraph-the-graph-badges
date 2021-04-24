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
