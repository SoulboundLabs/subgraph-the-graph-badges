import { BigInt, ethereum } from "@graphprotocol/graph-ts/index";
import { Allocation, IndexerCount } from "../../generated/schema";
import {
  AllocationClosed,
  AllocationCreated,
} from "../../generated/Staking/Staking";
import { epochToEra, transitionToNewEraIfNeeded } from "../helpers/epoch";
import {
  create28EpochsLaterBadge,
  createAllocation,
  createOrLoadEntityStats,
  createOrLoadIndexer,
  createOrLoadIndexerEra,
} from "../helpers/models";
import { toBigInt } from "../helpers/typeConverter";

export function processAllocationCreatedFor28DaysLaterBadge(
  event: AllocationCreated
): void {
  createAllocation(
    event.params.allocationID.toHexString(),
    event.params.indexer.toHexString(),
    event.params.epoch
  );
  transitionToNewEraIfNeeded(event.params.epoch, event.block);
}

export function processAllocationClosedFor28DaysLaterBadge(
  event: AllocationClosed
): void {
  checkClosingAllocationLate(
    event.params.allocationID.toHexString(),
    event.params.indexer.toHexString(),
    event.params.epoch
  );
  transitionToNewEraIfNeeded(event.params.epoch, event.block);
}

export function process28DaysLaterBadgesForEra(
  era: BigInt,
  block: ethereum.Block
): void {
  // finalize any "pending" badges from this epoch
  let entityStats = createOrLoadEntityStats();

  for (let i = 1; i < entityStats.indexerCount; i++) {
    let indexerCount = IndexerCount.load(i.toString());
    let indexerEra = createOrLoadIndexerEra(indexerCount.indexer, era);
    if (!indexerEra.isClosingAllocationLate) {
      create28EpochsLaterBadge(indexerCount.indexer, era, block);
    }
  }
}

function checkClosingAllocationLate(
  allocationId: string,
  indexerId: string,
  currentEpoch: BigInt
): void {
  let indexer = createOrLoadIndexer(indexerId);
  let era = epochToEra(currentEpoch);
  let indexerEra = createOrLoadIndexerEra(indexer.id, era);

  let allocation = Allocation.load(allocationId);

  let epochsToClose = currentEpoch.minus(allocation.createdAtEpoch);
  let isUnder28Epochs = epochsToClose.lt(toBigInt(28));

  if (!isUnder28Epochs) {
    indexerEra.isClosingAllocationLate = true;
    indexerEra.save();
  }
}
