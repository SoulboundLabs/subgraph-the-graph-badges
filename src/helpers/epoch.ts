import { BigInt } from "@graphprotocol/graph-ts/index";
import { toBigInt } from "./typeConverter";

export function epochToEra(epoch: BigInt): BigInt {
  return epoch.div(toBigInt(28));
}
