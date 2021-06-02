import { BigInt } from "@graphprotocol/graph-ts/index";
import {
  Allocation,
  Delegator,
  EntityStats,
  Indexer,
  IndexerCount,
  IndexerEra,
  NeverSlashedBadge,
  TwentyEightEpochsLaterBadge,
} from "../../generated/schema";
import { zeroBD } from "./constants";
import { toBigInt } from "./typeConverter";

export function createOrLoadEntityStats(): EntityStats {
  let entityStats = EntityStats.load("1");

  if (entityStats == null) {
    entityStats = new EntityStats("1");
    entityStats.indexerCount = 0;
    entityStats.firstToCloseBadgeCount = 0;
    entityStats.twentyEightDaysLaterBadgeCount = 0;
    entityStats.lastEraProcessed = toBigInt(0);
    entityStats.save();
  }

  return entityStats as EntityStats;
}

export function createOrLoadIndexer(id: string): Indexer {
  let indexer = Indexer.load(id);

  if (indexer == null) {
    indexer = new Indexer(id);
    indexer.isClosingAllocationLateCount = 0;
    indexer.twentyEightEpochsLaterBadgePercentage = zeroBD();
    indexer.save();

    let entityStats = createOrLoadEntityStats();
    let indexerCount = entityStats.indexerCount + 1;
    entityStats.indexerCount = indexerCount;
    entityStats.save();

    createOrLoadIndexerCount(indexerCount.toString(), indexer.id);
  }

  return indexer as Indexer;
}

export function createOrLoadDelegator(id: string): Delegator {
  let delegator = Delegator.load(id);

  if (delegator == null) {
    delegator = new Delegator(id);
    delegator.uniqueDelegationCount = 0;
    delegator.save();
  }

  return delegator as Delegator;
}

export function createOrLoadIndexerCount(
  id: string,
  indexer: string
): IndexerCount {
  let indexerCount = IndexerCount.load(id);

  if (indexerCount == null) {
    indexerCount = new IndexerCount(id);
    indexerCount.indexer = indexer;
    indexerCount.save();
  }

  return indexerCount as IndexerCount;
}

export function createOrLoadIndexerEra(
  indexerID: string,
  era: BigInt
): IndexerEra {
  let id = indexerID.concat("-").concat(era.toString());
  let indexerEra = IndexerEra.load(id);

  if (indexerEra == null) {
    indexerEra = new IndexerEra(id);
    indexerEra.era = era;
    indexerEra.indexer = indexerID;
    indexerEra.isClosingAllocationLate = false;
    indexerEra.isSlashed = false;
    indexerEra.save();
  }

  return indexerEra as IndexerEra;
}

export function createAllocation(
  allocationID: string,
  indexerID: string,
  epochCreated: BigInt
): void {
  if (Allocation.load(allocationID) == null) {
    let allocation = new Allocation(allocationID);
    allocation.createdAtEpoch = epochCreated;
    allocation.indexer = indexerID;

    allocation.save();
  }
}

export function create28EpochsLaterBadge(
  indexerID: string,
  currentEra: BigInt
): TwentyEightEpochsLaterBadge {
  let badgeID = indexerID.concat("-").concat(currentEra.toString());

  let twentyEightEpochsLater = new TwentyEightEpochsLaterBadge(badgeID);
  twentyEightEpochsLater.indexer = indexerID;
  twentyEightEpochsLater.eraAwarded = currentEra;
  twentyEightEpochsLater.save();

  return twentyEightEpochsLater as TwentyEightEpochsLaterBadge;
}

export function createNeverSlashedBadge(
  indexerID: string,
  currentEra: BigInt
): NeverSlashedBadge {
  let badgeID = indexerID.concat("-").concat(currentEra.toString());

  let neverSlashedBadge = new NeverSlashedBadge(badgeID);
  neverSlashedBadge.indexer = indexerID;
  neverSlashedBadge.eraAwarded = currentEra;
  neverSlashedBadge.save();

  return neverSlashedBadge as NeverSlashedBadge;
}
