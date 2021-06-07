import { BigInt } from "@graphprotocol/graph-ts/index";
import {
  Allocation,
  BadgeDetail,
  DelegationNationBadge,
  Delegator,
  EntityStats,
  FirstToCloseBadge,
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
  let badgeDetail = createOrLoadBadgeDetail(
    "28 Epochs Later",
    "Awarded to indexers who close their allocations every 28 epochs or fewer",
    "Kid, you're only as good as your last closed allocation",
    "NFT_GOES_HERE"
  );

  let twentyEightEpochsLater = new TwentyEightEpochsLaterBadge(badgeID);
  twentyEightEpochsLater.indexer = indexerID;
  twentyEightEpochsLater.eraAwarded = currentEra;
  twentyEightEpochsLater.badgeDetail = badgeDetail.id;
  twentyEightEpochsLater.save();

  return twentyEightEpochsLater as TwentyEightEpochsLaterBadge;
}

export function createNeverSlashedBadge(
  indexerID: string,
  currentEra: BigInt
): NeverSlashedBadge {
  let badgeID = indexerID.concat("-").concat(currentEra.toString());
  let badgeDetail = createOrLoadBadgeDetail(
    "Never Slashed",
    "Awarded to indexers who are don't get slashed during a era",
    "Freddy Kreuger would be proud",
    "NFT_GOES_HERE"
  );

  let neverSlashedBadge = new NeverSlashedBadge(badgeID);
  neverSlashedBadge.indexer = indexerID;
  neverSlashedBadge.eraAwarded = currentEra;
  neverSlashedBadge.badgeDetail = badgeDetail.id;
  neverSlashedBadge.save();

  return neverSlashedBadge as NeverSlashedBadge;
}

export function createDelegationNationBadge(delegator: Delegator): void {
  let entityStats = createOrLoadEntityStats();
  let badgeDetail = createOrLoadBadgeDetail(
    "Delegation Nation",
    "Awarded to delegators who delegate to 3 or more indexers during any epoch",
    "A seven nation army couldn't hold me back",
    "NFT_GOES_HERE"
  );
  let delegationNationBadge = new DelegationNationBadge(delegator.id);
  delegationNationBadge.delegator = delegator.id;
  delegationNationBadge.eraAwarded = entityStats.lastEraProcessed;
  delegationNationBadge.id = badgeDetail.id;

  delegationNationBadge.save();
}

export function createFirstToCloseBadge(
  subgraphDeploymentID: string,
  indexer: string
): void {
  let entityStats = createOrLoadEntityStats();
  let firstToClose = FirstToCloseBadge.load(subgraphDeploymentID);
  let badgeDetail = createOrLoadBadgeDetail(
    "First To Close",
    "Awarded to indexers who are first to close an allocation for a subgraph",
    "The early indexer gets the worm",
    "NFT_GOES_HERE"
  );
  if (firstToClose == null) {
    // FirstToCloseBadge hasn't been awarded for this subgraphDeploymentId yet
    // Award to this indexer
    firstToClose = new FirstToCloseBadge(subgraphDeploymentID);
    firstToClose.indexer = indexer;
    firstToClose.eraAwarded = entityStats.lastEraProcessed;
    firstToClose.badgeDetail = badgeDetail.id;
    firstToClose.save();
  }
}

export function createOrLoadBadgeDetail(
  name: string,
  description: string,
  tagline: string,
  image: string
): BadgeDetail {
  let badgeDetail = BadgeDetail.load(name);

  if (badgeDetail == null) {
    badgeDetail = new BadgeDetail(name);
    badgeDetail.description = description;
    badgeDetail.tagline = tagline;
    badgeDetail.image = image;
    badgeDetail.save();
  }

  return badgeDetail as BadgeDetail;
}
