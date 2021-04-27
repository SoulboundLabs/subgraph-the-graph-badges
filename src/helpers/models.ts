import { Address, ethereum } from "@graphprotocol/graph-ts";
import { EntityStats, Indexer, TwentyEightEpochsLaterBadge } from "../../generated/schema";
import { TwentyEightDaysLaterBadge } from "../types/schema";

export function createOrLoadEntityStats(): EntityStats {
  let entityStats = EntityStats.load("1");

  if (entityStats == null) {
    entityStats = new EntityStats("1");
    entityStats.indexerCount = 0;
    entityStats.firstToCloseBadgeCount = 0;
    entityStats.twentyEightDaysLaterBadgeCount = 0;
    entityStats.save();
  }

  return entityStats as EntityStats;
}

export function createOrLoadIndexer(id: string): Indexer {
  let indexer = Indexer.load(id);

  if (indexer == null) {
    indexer = new Indexer(id);
    indexer.maxEpochsToCloseAllocation = 0;
    indexer.save();

    let entityStats = createOrLoadEntityStats();
    entityStats.indexerCount = entityStats.indexerCount + 1;
    entityStats.save();
  }

  return indexer as Indexer;
}

export function createOrLoadTwentyEightDaysLaterBadge(
  indexer: Address
  block: ethereum.Block
): TwentyEightDaysLaterBadge {
  let indexerID = indexer.toHexString();
  let twentyEightEpochsLater = TwentyEightEpochsLaterBadge.load(indexerID);

  if (twentyEightEpochsLater == null) {
    // TwentyEightEpochsLater hasn't been awarded for this subgraphDeploymentId yet
    // Conditionally award to this indexer
    twentyEightEpochsLater = new TwentyEightEpochsLaterBadge(indexerID);
    twentyEightEpochsLater.indexer = indexer;
    twentyEightEpochsLater.awardedAtBlock = block.number;
    twentyEightEpochsLater.maxEpochsToCloseAllocation = maxEpochsToCloseAllocation;
    twentyEightEpochsLater.save();
  }

  return indexer as Indexer;
}
