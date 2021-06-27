import { BigInt } from "@graphprotocol/graph-ts/index";
import { IndexerCount } from "../../generated/schema";
import { StakeSlashed } from "../../generated/Staking/Staking";
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

export function processStakeSlashedForNeverSlashedBadge(
  event: StakeSlashed
): void {
  _processStakeSlashed(event.params.indexer.toHexString());
}

function _processStakeSlashed(indexerID: string): void {
  let entityStats = createOrLoadEntityStats();
  let indexer = createOrLoadIndexer(indexerID);
  let indexerEra = createOrLoadIndexerEra(
    indexer.id,
    entityStats.lastEraProcessed
  );

  indexerEra.isSlashed = true;
  indexerEra.save();
}

export function processNeverSlashedBadgesForEra(era: BigInt): void {
  // todo: finalize any "pending" badges from this epoch
  let entityStats = createOrLoadEntityStats();
  for (let i = 1; i < entityStats.indexerCount; i++) {
    let indexerCount = IndexerCount.load(i.toString());
    let indexerEra = createOrLoadIndexerEra(indexerCount.indexer, era);
    if (!indexerEra.isSlashed) {
      createNeverSlashedBadge(indexerCount.indexer, era);
    }
  }
}
