import { BigInt } from "@graphprotocol/graph-ts/index";
import { Allocation, IndexerCount } from "../../generated/schema";
import {
  AllocationClosed,
  AllocationCreated
} from "../../generated/Staking/Staking";
import { oneBI } from "../helpers/constants";
import { transitionToNewEpochIfNeeded } from "../helpers/epoch";
import {
  create28EpochsLaterBadge,
  createOrLoadEntityStats,
  createOrLoadIndexerEra
} from "../helpers/models";
import { toBigInt } from "../helpers/typeConverter";

export function processAllocationCreatedFor28DaysLaterBadge(
  event: AllocationCreated
): void {
  transitionToNewEpochIfNeeded(event.params.epoch);
  _processAllocationCreated(
    event.params.allocationID.toHexString(),
    event.params.epoch
  );
}

export function processAllocationClosedFor28DaysLaterBadge(
  event: AllocationClosed
): void {
  transitionToNewEpochIfNeeded(event.params.epoch);
  _processAllocationClosed(
    event.params.indexer.toHexString(),
    event.params.allocationID.toHexString(),
    event.params.epoch
  );
}

export function process28DaysLaterBadgesForEpoch(currentEpoch: BigInt): void {
  // todo: finalize any "pending" badges from this epoch
  let entityStats = createOrLoadEntityStats();
  let previousEpoch = currentEpoch.minus(oneBI());

  for (let i = 0; i < entityStats.indexerCount; i++) {
    let indexerCount = IndexerCount.load(i.toString());
    let indexerEra = createOrLoadIndexerEra(
      indexerCount.indexer,
      previousEpoch
    );
    if (!indexerEra.ineligibleTwentyEightEpochsLaterBadge) {
      create28EpochsLaterBadge(indexerCount.indexer, previousEpoch);
    }
  }
}

function _processAllocationCreated(
  allocationID: string,
  currentEpoch: BigInt
): void {
  let allocation = new Allocation(allocationID);
  allocation.createdAtEpoch = currentEpoch;
  allocation.save();
}

function _processAllocationClosed(
  indexerID: string,
  allocationID: string,
  currentEpoch: BigInt
): void {
  let indexerEra = createOrLoadIndexerEra(indexerID, currentEpoch);

  let allocation = Allocation.load(allocationID);

  let epochsToClose = currentEpoch.minus(allocation.createdAtEpoch);
  let isUnder28Epochs = epochsToClose.lt(toBigInt(28));

  if (!isUnder28Epochs) {
    indexerEra.ineligibleTwentyEightEpochsLaterBadge = true;
    indexerEra.save();
  }
}
