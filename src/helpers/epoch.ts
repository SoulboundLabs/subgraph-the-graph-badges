import { BigInt } from "@graphprotocol/graph-ts/index";
import { toBigInt } from "./typeConverter";
import { createOrLoadEntityStats } from "./models";
import { process28DaysLaterBadgesForEpoch } from "../Badges/28DaysLater";

export function epochToEra(epoch: BigInt): BigInt {
  return epoch.div(toBigInt(28));
}

export function transitionToNewEpochIfNeeded(epoch: BigInt): void {
  let entityStats = createOrLoadEntityStats();
  if (epoch.gt(entityStats.lastEpochUpdate)) {
    process28DaysLaterBadgesForEpoch(entityStats.lastEpochUpdate);
    entityStats.lastEpochUpdate = epoch;
    entityStats.save();
  }
}
