import { BigInt } from "@graphprotocol/graph-ts/index";
import { EntityStats, Indexer, IndexerEra } from "../../generated/schema";
import { zeroBI } from "./constants";
import { epochToEra } from "./epoch";

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
    indexer.twentyEightEpochsLaterStartStreak = zeroBI();
    indexer.save();

    let entityStats = createOrLoadEntityStats();
    entityStats.indexerCount = entityStats.indexerCount + 1;
    entityStats.save();
  }

  return indexer as Indexer;
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
    indexerEra.twentyEightEpochsLaterBadge = "Unawarded";
    indexerEra.save();
  }

  return indexerEra as IndexerEra;
}
