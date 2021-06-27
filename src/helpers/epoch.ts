import { BigInt } from "@graphprotocol/graph-ts/index";
import { toBigInt } from "./typeConverter";
import { createOrLoadEntityStats } from "./models";
import { process28DaysLaterBadgesForEra } from "../Badges/28DaysLater";
import { processNeverSlashedBadgesForEra } from "../Badges/neverSlashed";

export function epochToEra(epoch: BigInt): BigInt {
  return epoch.div(toBigInt(28));
}

export function transitionToNewEraIfNeeded(epoch: BigInt): void {
  let entityStats = createOrLoadEntityStats();
  let era = epochToEra(epoch);
  if (era.gt(entityStats.lastEraProcessed)) {
    _processBadgesForEra(entityStats.lastEraProcessed);
    entityStats.lastEraProcessed = era;
    entityStats.save();
  }
}

function _processBadgesForEra(era: BigInt): void {
  process28DaysLaterBadgesForEra(era);
  processNeverSlashedBadgesForEra(era);
}
