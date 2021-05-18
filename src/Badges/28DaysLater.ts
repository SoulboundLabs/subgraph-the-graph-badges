import { AllocationCreated, AllocationClosed } from "../../generated/Staking/Staking";
import { BigInt } from "@graphprotocol/graph-ts/index";
import { createOrLoadIndexer, createOrLoadIndexerEra } from "../helpers/models";
import { epochToEra } from "../helpers/epoch";
import { toBigInt } from "../helpers/typeConverter";
import { store } from "@graphprotocol/graph-ts";
import { oneBD } from "../helpers/constants";
import { transitionToNewEpochIfNeeded } from "../helpers/epoch";
import {
    Allocation,
    TwentyEightEpochsLaterBadge,
} from "../../generated/schema";



export function processAllocationCreatedFor28DaysLaterBadge(event: AllocationCreated): void {
  transitionToNewEpochIfNeeded(event.params.epoch);
  _processAllocationCreated(
      event.params.allocationID.toHexString(),
      event.params.epoch
  );
}

export function processAllocationClosedFor28DaysLaterBadge(event: AllocationClosed): void {
  transitionToNewEpochIfNeeded(event.params.epoch);
  _processAllocationClosed(
      event.params.indexer.toHexString(),
      event.params.allocationID.toHexString(),
      event.params.epoch
  );
}

export function process28DaysLaterBadgesForEpoch(epoch: BigInt): void {
  // todo: finalize any "pending" badges from this epoch
}

function _processAllocationCreated(allocationID: string, currentEpoch: BigInt): void {
    let allocation = new Allocation(allocationID);
    allocation.createdAtEpoch = currentEpoch;
    allocation.save();
}

function _processAllocationClosed(indexerID: string, allocationID: string, currentEpoch: BigInt): void {
    let indexer = createOrLoadIndexer(indexerID);
    let indexerEra = createOrLoadIndexerEra(indexerID, currentEpoch);
  
    let allocation = Allocation.load(allocationID);
  
    let epochsToClose = currentEpoch.minus(allocation.createdAtEpoch);
    let isUnder28Epochs = epochsToClose.lt(toBigInt(28));
  
    // let epochStreakLength = currentEpoch.minus(
    //   indexer.twentyEightEpochsLaterStartStreak
    // );
  
    let currentEra = epochToEra(currentEpoch);
  
    let badgeID = indexerID.concat("-").concat(currentEra.toString());
    let twentyEightEpochsLater = TwentyEightEpochsLaterBadge.load(badgeID);
  
    let noBadgeAwarded = twentyEightEpochsLater == null;
  
    let isUnawarded = indexerEra.twentyEightEpochsLaterBadge == "Unawarded";
    let isAwarded = indexerEra.twentyEightEpochsLaterBadge == "Awarded";
    let isIneligible = indexerEra.twentyEightEpochsLaterBadge == "Ineligible";
  
    let awardBadge = isUnder28Epochs && noBadgeAwarded && isUnawarded;
    let addBadgeStreak = isUnder28Epochs && !noBadgeAwarded && isAwarded;
    let invalidateBadge = !isUnder28Epochs && !isIneligible;
  
    if (awardBadge) {
      twentyEightEpochsLater = new TwentyEightEpochsLaterBadge(badgeID);
      twentyEightEpochsLater.indexer = indexer.id;
      twentyEightEpochsLater.eraAwarded = currentEra;
      twentyEightEpochsLater.save();
  
      indexerEra.twentyEightEpochsLaterBadge = "Awarded";
      indexerEra.save();
    } else if (addBadgeStreak) {
      // twentyEightEpochsLater.epochStreakLength = epochStreakLength;
      // twentyEightEpochsLater.save();
    } else if (invalidateBadge) {
      store.remove("TwentyEightEpochsLaterBadge", badgeID);
  
      let ineligibleTwentyEightEpochsLaterBadgeCount =
        indexer.ineligibleTwentyEightEpochsLaterBadgeCount + 1;
      indexer.twentyEightEpochsLaterBadgePercentage =
        oneBD() -
        BigInt.fromI32(
          ineligibleTwentyEightEpochsLaterBadgeCount
        ).toBigDecimal() /
          currentEra.toBigDecimal();
      indexer.ineligibleTwentyEightEpochsLaterBadgeCount = ineligibleTwentyEightEpochsLaterBadgeCount;
      indexer.save();
  
      indexerEra.twentyEightEpochsLaterBadge = "Ineligible";
      indexerEra.save();
    }
}

