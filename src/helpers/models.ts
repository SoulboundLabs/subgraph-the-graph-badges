export function createOrLoadEntityStats(id: string): Indexer {
  let entityStats = EntityStats.load("1");
  if (entityStats == null) {
    entityStats = new EntityStats("1");

    let entityStats = EntityStats.load("1");
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
