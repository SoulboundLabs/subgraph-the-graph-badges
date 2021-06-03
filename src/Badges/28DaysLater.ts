import { BigInt, log } from "@graphprotocol/graph-ts/index";
import { Allocation, IndexerCount } from "../../generated/schema";
import {
  AllocationClosed,
  AllocationCreated
} from "../../generated/Staking/Staking";
import { oneBI } from "../helpers/constants";
import { transitionToNewEraIfNeeded } from "../helpers/epoch";
import {
  create28EpochsLaterBadge,
  createOrLoadEntityStats,
  createOrLoadIndexer,
  createOrLoadIndexerEra,
  createAllocation
} from "../helpers/models";
import { toBigInt } from "../helpers/typeConverter";

export function processAllocationCreatedFor28DaysLaterBadge(
  event: AllocationCreated
): void {
  _processAllocationCreated(
    event.params.allocationID.toHexString(),
    event.params.indexer.toHexString(),
    event.params.epoch
  );
  transitionToNewEraIfNeeded(event.params.epoch);
}

export function processAllocationClosedFor28DaysLaterBadge(
  event: AllocationClosed
): void {
  _processAllocationClosed(
    event.params.allocationID.toHexString(),
    event.params.indexer.toHexString(),
    event.params.epoch
  );
  transitionToNewEraIfNeeded(event.params.epoch);
}

export function process28DaysLaterBadgesForEra(era: BigInt): void {
  // finalize any "pending" badges from this epoch
  let entityStats = createOrLoadEntityStats();

  for (let i = 1; i < entityStats.indexerCount; i++) {
    log.info("FORLOOP", []);
    let indexerCount = IndexerCount.load(i.toString());
    let indexerEra = createOrLoadIndexerEra(
      indexerCount.indexer,
      era
    );
    if (!indexerEra.ineligibleTwentyEightEpochsLaterBadge) {
      create28EpochsLaterBadge(indexerCount.indexer, era);
    }
  }
}

function _processAllocationCreated(
  allocationId: string,
  indexerId: string,
  currentEpoch: BigInt
): void {
  createAllocation(allocationId, indexerId, currentEpoch);
}

function _processAllocationClosed(
  allocationId: string,
  indexerId: string,
  currentEpoch: BigInt
): void {
  let indexer = createOrLoadIndexer(indexerId);
  let indexerEra = createOrLoadIndexerEra(indexer.id, currentEpoch);

  let allocation = Allocation.load(allocationId);

  let epochsToClose = currentEpoch.minus(allocation.createdAtEpoch);
  let isUnder28Epochs = epochsToClose.lt(toBigInt(28));

  if (!isUnder28Epochs) {
    indexerEra.ineligibleTwentyEightEpochsLaterBadge = true;
    indexerEra.save();
  }
}
