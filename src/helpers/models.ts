import { BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts/index";
import {
  Allocation,
  BadgeAward,
  BadgeDetail,
  DelegatedStake,
  DelegationStreakBadge,
  Delegator,
  DelegatorCount,
  EntityStats,
  Indexer,
  IndexerCount,
  IndexerEra,
  Voter,
} from "../../generated/schema";
import {
  BADGE_DESCRIPTION_28_EPOCHS_LATER,
  BADGE_DESCRIPTION_DELEGATION_NATION,
  BADGE_DESCRIPTION_DELEGATION_STREAK,
  BADGE_DESCRIPTION_FIRST_TO_CLOSE,
  BADGE_DESCRIPTION_NEVER_SLASHED,
  BADGE_NAME_28_EPOCHS_LATER,
  BADGE_NAME_DELEGATION_NATION,
  BADGE_NAME_DELEGATION_STREAK,
  BADGE_NAME_FIRST_TO_CLOSE,
  BADGE_NAME_NEVER_SLASHED,
  BADGE_VOTE_WEIGHT_28_EPOCHS_LATER,
  BADGE_VOTE_WEIGHT_DELEGATION_NATION,
  BADGE_VOTE_WEIGHT_DELEGATION_STREAK,
  BADGE_VOTE_WEIGHT_FIRST_TO_CLOSE,
  BADGE_VOTE_WEIGHT_NEVER_SLASHED,
  zeroBD,
} from "./constants";
import { toBigInt } from "./typeConverter";

export function createOrLoadEntityStats(): EntityStats {
  let entityStats = EntityStats.load("1");

  if (entityStats == null) {
    entityStats = new EntityStats("1");
    entityStats.indexerCount = 0;
    entityStats.delegatorCount = 0;
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
    delegator.uniqueActiveDelegationCount = 0;
    delegator.streakStartBlockNumber = toBigInt(-1);
    delegator.save();

    let entityStats = createOrLoadEntityStats();
    let delegatorCount = entityStats.delegatorCount + 1;
    entityStats.delegatorCount = delegatorCount;
    entityStats.save();

    createOrLoadDelegatorCount(delegatorCount.toString(), delegator.id);
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

function createOrLoadDelegatorCount(
  id: string,
  delegator: string
): DelegatorCount {
  let delegatorCount = DelegatorCount.load(id);

  if (delegatorCount == null) {
    delegatorCount = new DelegatorCount(id);
    delegatorCount.delegator = delegator;
    delegatorCount.save();
  }

  return delegatorCount as DelegatorCount;
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

export function createOrLoadDelegatedStake(
  delegatorId: string,
  indexerId: string
): DelegatedStake {
  let id = delegatorId.concat("-").concat(indexerId);
  let delegatedStake = DelegatedStake.load(id);

  if (delegatedStake == null) {
    delegatedStake = new DelegatedStake(id);
    delegatedStake.delegator = delegatorId;
    delegatedStake.indexer = indexerId;
    delegatedStake.shares = toBigInt(0);
    delegatedStake.save();
  }

  return delegatedStake as DelegatedStake;
}

export function delegatedStakeExists(
  delegatorId: string,
  indexerId: string
): boolean {
  let id = delegatorId.concat("-").concat(indexerId);
  let delegatedStake = DelegatedStake.load(id);
  return delegatedStake != null;
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

export function addVotingPower(voterId: string, votingPower: BigDecimal): void {
  if (votingPower.equals(zeroBD())) {
    return;
  }

  let voter = Voter.load(voterId);
  if (voter == null) {
    voter = new Voter(voterId);
    voter.votingPower = votingPower;
  } else {
    voter.votingPower = voter.votingPower.plus(votingPower);
  }
  voter.save();
}

export function create28EpochsLaterBadge(
  indexerID: string,
  era: BigInt,
  block: ethereum.Block
): BadgeAward {
  let badgeID = indexerID.concat("-").concat(era.toString());
  let badgeDetail = createOrLoadBadgeDetail(
    BADGE_NAME_28_EPOCHS_LATER,
    BADGE_DESCRIPTION_28_EPOCHS_LATER,
    BigDecimal.fromString(BADGE_VOTE_WEIGHT_28_EPOCHS_LATER),
    "NFT_GOES_HERE"
  );
  incrementBadgeCount(badgeDetail.id);

  let twentyEightEpochsLater = new BadgeAward(badgeID);
  twentyEightEpochsLater.winner = indexerID;
  twentyEightEpochsLater.blockAwarded = block.number;
  twentyEightEpochsLater.badgeDetail = badgeDetail.id;
  twentyEightEpochsLater.badgeNumber = badgeDetail.badgeCount;
  twentyEightEpochsLater.save();
  addVotingPower(indexerID, badgeDetail.votingWeightMultiplier);

  return twentyEightEpochsLater as BadgeAward;
}

export function createNeverSlashedBadge(
  indexerID: string,
  currentEra: BigInt,
  block: ethereum.Block
): BadgeAward {
  let badgeID = indexerID.concat("-").concat(currentEra.toString());
  let badgeDetail = createOrLoadBadgeDetail(
    BADGE_NAME_NEVER_SLASHED,
    BADGE_DESCRIPTION_NEVER_SLASHED,
    BigDecimal.fromString(BADGE_VOTE_WEIGHT_NEVER_SLASHED),
    "NFT_GOES_HERE"
  );
  incrementBadgeCount(badgeDetail.id);

  let neverSlashedBadge = new BadgeAward(badgeID);
  neverSlashedBadge.winner = indexerID;
  neverSlashedBadge.blockAwarded = block.number;
  neverSlashedBadge.badgeDetail = badgeDetail.id;
  neverSlashedBadge.badgeNumber = badgeDetail.badgeCount;
  neverSlashedBadge.save();
  addVotingPower(indexerID, badgeDetail.votingWeightMultiplier);

  return neverSlashedBadge as BadgeAward;
}

export function createDelegationNationBadge(
  delegator: Delegator,
  blockNumber: BigInt
): void {
  let badgeDetail = createOrLoadBadgeDetail(
    BADGE_NAME_DELEGATION_NATION,
    BADGE_DESCRIPTION_DELEGATION_NATION,
    BigDecimal.fromString(BADGE_VOTE_WEIGHT_DELEGATION_NATION),
    "NFT_GOES_HERE"
  );
  incrementBadgeCount(badgeDetail.id);

  let delegationNationBadge = new BadgeAward(delegator.id);
  delegationNationBadge.winner = delegator.id;
  delegationNationBadge.blockAwarded = blockNumber;
  delegationNationBadge.badgeDetail = badgeDetail.id;
  delegationNationBadge.badgeNumber = badgeDetail.badgeCount;
  delegationNationBadge.save();
  addVotingPower(delegator.id, badgeDetail.votingWeightMultiplier);
}

export function createOrLoadDelegationStreakBadge(
  delegator: Delegator,
  startBlockNumber: BigInt
): DelegationStreakBadge {
  let badgeDetail = createOrLoadBadgeDetail(
    BADGE_NAME_DELEGATION_STREAK,
    BADGE_DESCRIPTION_DELEGATION_STREAK,
    BigDecimal.fromString(BADGE_VOTE_WEIGHT_DELEGATION_STREAK),
    "NFT_GOES_HERE"
  );
  let badgeId = delegator.id.concat(startBlockNumber.toString());
  let badge = DelegationStreakBadge.load(badgeId);
  if (badge == null) {
    incrementBadgeCount(badgeDetail.id);

    badge = new DelegationStreakBadge(badgeId);
    badge.delegator = delegator.id;
    badge.startBlockNumber = startBlockNumber;
    badge.lastCheckpointBlockNumber = startBlockNumber;
    badge.blockAwarded = toBigInt(-1);
    badge.badgeDetail = badgeDetail.id;
    badge.badgeNumber = badgeDetail.badgeCount;

    badge.save();
  }
  return badge as DelegationStreakBadge;
}

export function createFirstToCloseBadge(
  subgraphDeploymentID: string,
  indexer: string,
  block: ethereum.Block
): void {
  let entityStats = createOrLoadEntityStats();
  let firstToClose = BadgeAward.load(subgraphDeploymentID);
  let badgeDetail = createOrLoadBadgeDetail(
    BADGE_NAME_FIRST_TO_CLOSE,
    BADGE_DESCRIPTION_FIRST_TO_CLOSE,
    BigDecimal.fromString(BADGE_VOTE_WEIGHT_FIRST_TO_CLOSE),
    "NFT_GOES_HERE"
  );
  if (firstToClose == null) {
    incrementBadgeCount(badgeDetail.id);

    // FirstToCloseBadge hasn't been awarded for this subgraphDeploymentId yet
    // Award to this indexer
    firstToClose = new BadgeAward(subgraphDeploymentID);
    firstToClose.winner = indexer;
    firstToClose.blockAwarded = block.number;
    firstToClose.badgeDetail = badgeDetail.id;
    firstToClose.badgeNumber = badgeDetail.badgeCount;
    firstToClose.save();

    entityStats.save();

    addVotingPower(indexer, badgeDetail.votingWeightMultiplier);
  }
}

export function createOrLoadBadgeDetail(
  name: string,
  description: string,
  voteWeight: BigDecimal,
  image: string
): BadgeDetail {
  let badgeDetail = BadgeDetail.load(name);

  if (badgeDetail == null) {
    badgeDetail = new BadgeDetail(name);
    badgeDetail.description = description;
    badgeDetail.image = image;
    badgeDetail.votingWeightMultiplier = voteWeight;
    badgeDetail.badgeCount = 0;
    badgeDetail.save();
  }

  return badgeDetail as BadgeDetail;
}

export function incrementBadgeCount(badgeName: string): BadgeDetail {
  let badgeDetail = BadgeDetail.load(badgeName);
  badgeDetail.badgeCount = badgeDetail.badgeCount + 1;
  badgeDetail.save();

  return badgeDetail as BadgeDetail;
}
