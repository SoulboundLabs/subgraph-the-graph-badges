import { BigInt } from "@graphprotocol/graph-ts/index";
import {
  Allocation,
  EntityStats,
  Indexer,
  IndexerCount,
  IndexerEra,
  TwentyEightEpochsLaterBadge,
  NeverBeenSlashedBadge
} from "../../generated/schema";
import { zeroBD } from "./constants";
import { epochToEra } from "./epoch";
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
    indexer.ineligibleTwentyEightEpochsLaterBadgeCount = 0;
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
  epoch: BigInt
): IndexerEra {
  let era = epochToEra(epoch);

  let id = indexerID.concat("-").concat(era.toString());
  let indexerEra = IndexerEra.load(id);

  if (indexerEra == null) {
    indexerEra = new IndexerEra(id);
    indexerEra.era = era;
    indexerEra.indexer = indexerID;
    indexerEra.ineligibleTwentyEightEpochsLaterBadge = false;
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

    allocation.save();
  }
}

export function create28EpochsLaterBadge(
  indexerID: string,
  era: BigInt
): TwentyEightEpochsLaterBadge {

  let badgeID = indexerID.concat("-").concat(era.toString());

  let twentyEightEpochsLater = new TwentyEightEpochsLaterBadge(badgeID);
  twentyEightEpochsLater.indexer = indexerID;
  twentyEightEpochsLater.eraAwarded = era;
  twentyEightEpochsLater.save();

  return twentyEightEpochsLater as TwentyEightEpochsLaterBadge;
}

export function createNeverSlashedBadge(
  indexerID: string,
  era: BigInt
): NeverBeenSlashedBadge {

  let badgeID = indexerID.concat("-").concat(era.toString());

  let neverSlashedBadge = new NeverBeenSlashedBadge(badgeID);
  neverSlashedBadge.indexer = indexerID;
  neverSlashedBadge.eraAwarded = era;
  neverSlashedBadge.save();

  return neverSlashedBadge as NeverBeenSlashedBadge;
}

