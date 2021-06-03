import { BigInt, log } from "@graphprotocol/graph-ts/index";
import { Allocation, IndexerCount } from "../../generated/schema";
import {
  AllocationClosed,
  AllocationCreated
} from "../../generated/Staking/Staking";
import { transitionToNewEraIfNeeded } from "../helpers/epoch";
import {
  createOrLoadEntityStats,
  createOrLoadIndexer,
  createOrLoadIndexerEra,
  createAllocation,
  createNeverSlashedBadge
} from "../helpers/models";
import { toBigInt } from "../helpers/typeConverter";



export function processAllocationCreatedForNeverSlashedBadge(
  event: AllocationCreated
): void {
  _processAllocationCreated(
    event.params.allocationID.toHexString(),
    event.params.indexer.toHexString(),
    event.params.epoch
  );
  transitionToNewEraIfNeeded(event.params.epoch);
}

export function processAllocationClosedForNeverSlashedBadge(
  event: AllocationClosed
): void {
  _processAllocationClosed(
    event.params.indexer.toHexString(),
    event.params.allocationID.toHexString(),
    event.params.epoch
  );
  transitionToNewEraIfNeeded(event.params.epoch);
}

function _processAllocationCreated(
  allocationID: string,
  indexerID: string,
  currentEpoch: BigInt
): void {
  createAllocation(allocationID, indexerID, currentEpoch);
}

function _processAllocationClosed(
  indexerID: string,
  allocationID: string,
  currentEpoch: BigInt
): void {
  let indexer = createOrLoadIndexer(indexerID);
  let indexerEra = createOrLoadIndexerEra(indexer.id, currentEpoch);

  let allocation = Allocation.load(allocationID);

  let epochsToClose = currentEpoch.minus(allocation.createdAtEpoch);
  let isUnder28Epochs = epochsToClose.lt(toBigInt(28));

  if (!isUnder28Epochs) {
    indexerEra.ineligibleTwentyEightEpochsLaterBadge = true;
    indexerEra.save();
  }
}

export function processNeverSlashedBadgesForEra(era: BigInt): void {
  let entityStats = createOrLoadEntityStats();

  for (let i = 1; i < entityStats.indexerCount; i++) {
    log.info("FORLOOP", []);
    let indexerCount = IndexerCount.load(i.toString());
    let indexerEra = createOrLoadIndexerEra(
      indexerCount.indexer,
      era
    );
    if (!indexerEra.ineligibleNeverSlashedBadge) {
      createNeverSlashedBadge(indexerCount.indexer, era);
    }
  }
}