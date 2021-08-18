import { BigInt } from "@graphprotocol/graph-ts/index";

export function toBigInt(integer: i32): BigInt {
  return BigInt.fromI32(integer);
}

// WARNING: This is only an estimate based on average block time
export function daysToBlocks(days: BigInt): BigInt {
  return days.times(BigInt.fromI32(6291));
}
