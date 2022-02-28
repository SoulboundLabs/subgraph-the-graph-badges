import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export function zeroBD(): BigDecimal {
  return BigDecimal.fromString("0");
}

export function oneBD(): BigDecimal {
  return BigDecimal.fromString("1");
}

export function sixteenBD(): BigDecimal {
  return BigDecimal.fromString("16");
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

export const PROTOCOL_ROLE_INDEXER = "INDEXER";
export const PROTOCOL_ROLE_DELEGATOR = "DELEGATOR";
export const PROTOCOL_ROLE_CURATOR = "CURATOR";
export const PROTOCOL_ROLE_SUBGRAPH_DEVELOPER = "SUBGRAPH_DEVELOPER";
export const PROTOCOL_ROLE_CONSUMER = "CONSUMER";
