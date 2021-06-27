import { BigInt, log } from "@graphprotocol/graph-ts/index";
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
  log.info("event.params.indexer", [event.params.indexer.toHexString()]);
  log.info("event.params.allocationID", [
    event.params.allocationID.toHexString(),
  ]);
  log.info("event.params.epoch", [event.params.epoch.toString()]);
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
    let indexerCount = IndexerCount.load(i.toString());
    let indexerEra = createOrLoadIndexerEra(indexerCount.indexer, era);
    if (!indexerEra.isClosingAllocationLate) {
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
  log.info("currentEpoch", [currentEpoch.toString()]);
  let indexer = createOrLoadIndexer(indexerId);
  let era = epochToEra(currentEpoch);
  let indexerEra = createOrLoadIndexerEra(indexer.id, era);

  log.info("era", [era.toString()]);

  let allocation = Allocation.load(allocationId);

  let epochsToClose = currentEpoch.minus(allocation.createdAtEpoch);
  log.info("epochsToClose", [epochsToClose.toString()]);

  let isUnder28Epochs = epochsToClose.lt(toBigInt(28));

  log.info("isUnder28Epochs", [isUnder28Epochs.toString()]);

  if (!isUnder28Epochs) {
    indexerEra.isClosingAllocationLate = true;
    indexerEra.save();
  }
}
