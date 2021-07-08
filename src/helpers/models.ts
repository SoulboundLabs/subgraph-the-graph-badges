import { BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts/index";
import {
  Allocation,
  AwardedAt,
  BadgeAward,
  BadgeDefinition,
  BadgeStreakProperties,
  DelegatedStake,
  Delegator,
  DelegatorCount,
  EntityStats,
  Indexer,
  IndexerCount,
  IndexerEra,
  Protocol,
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
  BADGE_URL_HANDLE_28_EPOCHS_LATER,
  BADGE_URL_HANDLE_DELEGATION_NATION,
  BADGE_URL_HANDLE_DELEGATION_STREAK,
  BADGE_URL_HANDLE_FIRST_TO_CLOSE,
  BADGE_URL_HANDLE_NEVER_SLASHED,
  BADGE_VOTE_POWER_28_EPOCHS_LATER,
  BADGE_VOTE_POWER_DELEGATION_NATION,
  BADGE_VOTE_POWER_DELEGATION_STREAK,
  BADGE_VOTE_POWER_FIRST_TO_CLOSE,
  BADGE_VOTE_POWER_NEVER_SLASHED,
  PROTOCOL_DESCRIPTION_THE_GRAPH,
  PROTOCOL_NAME_THE_GRAPH,
  PROTOCOL_URL_HANDLE_THE_GRAPH,
  PROTOCOL_WEBSITE_THE_GRAPH,
  zeroBD,
  AWARDED_AT_TYPE_ERA,
  AWARDED_AT_TYPE_BLOCK, zeroBI
} from "./constants";
import {
  addresses
} from "../../config/addresses";
import { toBigInt } from "./typeConverter";

export function createOrLoadEntityStats(): EntityStats {
  let entityStats = EntityStats.load("1");

  if (entityStats == null) {
    entityStats = new EntityStats("1");
    entityStats.indexerCount = 0;
    entityStats.delegatorCount = 0;
    entityStats.lastEraProcessed = toBigInt(0);
    entityStats.save();

    // _createTestBadgeAwards();     // awards badges to DAO and dev addresses
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

export function addVotingPower(voterId: string, votingPower: BigInt): void {
  if (votingPower.equals(zeroBI())) {
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
): BadgeAward {
  let badgeID = BADGE_NAME_28_EPOCHS_LATER.concat("-")
    .concat(indexerID)
    .concat("-")
    .concat(era.toString());
  let badgeDefinition = createOrLoadBadgeDefinition(
    BADGE_NAME_28_EPOCHS_LATER,
    BADGE_URL_HANDLE_28_EPOCHS_LATER,
    BADGE_DESCRIPTION_28_EPOCHS_LATER,
    BigInt.fromI32(BADGE_VOTE_POWER_28_EPOCHS_LATER),
    "TBD",
    "TBD"
  );
  incrementBadgeCount(badgeDefinition.id);

  let twentyEightEpochsLater = new BadgeAward(badgeID);
  twentyEightEpochsLater.winner = indexerID;
  twentyEightEpochsLater.awardedAt = createAwardedAtEra(twentyEightEpochsLater, era).id;
  twentyEightEpochsLater.definition = badgeDefinition.id;
  twentyEightEpochsLater.badgeNumber = badgeDefinition.badgeCount;
  twentyEightEpochsLater.save();
  addVotingPower(indexerID, badgeDefinition.votingPower);

  return twentyEightEpochsLater as BadgeAward;
}

export function createNeverSlashedBadge(
  indexerID: string,
  era: BigInt
): BadgeAward {
  let badgeID = BADGE_NAME_NEVER_SLASHED.concat("-")
    .concat(indexerID)
    .concat("-")
    .concat(era.toString());
  let badgeDefinition = createOrLoadBadgeDefinition(
    BADGE_NAME_NEVER_SLASHED,
    BADGE_URL_HANDLE_NEVER_SLASHED,
    BADGE_DESCRIPTION_NEVER_SLASHED,
    BigInt.fromI32(BADGE_VOTE_POWER_NEVER_SLASHED),
    "TBD",
    "TBD"
  );
  incrementBadgeCount(badgeDefinition.id);

  let neverSlashedBadge = new BadgeAward(badgeID);
  neverSlashedBadge.winner = indexerID;
  neverSlashedBadge.awardedAt = createAwardedAtEra(neverSlashedBadge, era).id;
  neverSlashedBadge.definition = badgeDefinition.id;
  neverSlashedBadge.badgeNumber = badgeDefinition.badgeCount;
  neverSlashedBadge.save();
  addVotingPower(indexerID, badgeDefinition.votingPower);

  return neverSlashedBadge as BadgeAward;
}

export function createDelegationNationBadge(
  delegator: Delegator,
  blockNumber: BigInt
): void {
  let badgeID = BADGE_NAME_DELEGATION_NATION.concat("-")
    .concat(delegator.id)
    .concat("-")
    .concat(blockNumber.toString());
  let badgeDefinition = createOrLoadBadgeDefinition(
    BADGE_NAME_DELEGATION_NATION,
    BADGE_URL_HANDLE_DELEGATION_NATION,
    BADGE_DESCRIPTION_DELEGATION_NATION,
    BigInt.fromI32(BADGE_VOTE_POWER_DELEGATION_NATION),
    "TBD",
    "TBD"
  );
  incrementBadgeCount(badgeDefinition.id);

  let delegationNationBadge = new BadgeAward(badgeID);
  delegationNationBadge.winner = delegator.id;
  delegationNationBadge.awardedAt = createAwardedAtBlock(delegationNationBadge, blockNumber).id;
  delegationNationBadge.definition = badgeDefinition.id;
  delegationNationBadge.badgeNumber = badgeDefinition.badgeCount;
  delegationNationBadge.save();
  addVotingPower(delegator.id, badgeDefinition.votingPower);
}

export function createOrLoadDelegationStreakBadge(
  delegator: Delegator,
  startBlockNumber: BigInt
): BadgeAward {
  let badgeId = BADGE_NAME_DELEGATION_STREAK.concat("-")
    .concat(delegator.id)
    .concat("-")
    .concat(startBlockNumber.toString());
  let badge = BadgeAward.load(badgeId);
  if (badge == null) {
    let badgeDefinition = createOrLoadBadgeDefinition(
      BADGE_NAME_DELEGATION_STREAK,
      BADGE_URL_HANDLE_DELEGATION_STREAK,
      BADGE_DESCRIPTION_DELEGATION_STREAK,
      BigInt.fromI32(BADGE_VOTE_POWER_DELEGATION_STREAK),
      "TBD",
      "TBD"
    );

    incrementBadgeCount(badgeDefinition.id);

    badge = new BadgeAward(badgeId);
    badge.winner = delegator.id;
    badge.awardedAt = createAwardedAtBlock(badge as BadgeAward, zeroBI()).id;
    badge.definition = badgeDefinition.id;
    badge.badgeNumber = badgeDefinition.badgeCount;
    let streakProperties = createOrLoadStreakProperties(delegator.id, startBlockNumber, badge as BadgeAward);
    badge.streakProperties = streakProperties.id;

    badge.save();
    addVotingPower(delegator.id, badgeDefinition.votingPower);
  }
  return badge as BadgeAward;
}

export function createOrLoadStreakProperties(
  delegator: string,
  startBlockNumber: BigInt,
  badgeAward: BadgeAward
): BadgeStreakProperties {
  let id = delegator.concat("-")
    .concat(startBlockNumber.toString());

  let streakProps = BadgeStreakProperties.load(id);
  if (streakProps == null) {
    streakProps = new BadgeStreakProperties(id);
    streakProps.badgeAward = badgeAward.id;
    streakProps.streakStartBlockNumber = startBlockNumber;
    streakProps.save();
  }
  return streakProps as BadgeStreakProperties;
}

export function createFirstToCloseBadge(
  subgraphDeploymentID: string,
  indexer: string,
  blockNumber: BigInt
): void {
  let firstToClose = BadgeAward.load(subgraphDeploymentID);
  if (firstToClose == null) {
    let badgeID =
      BADGE_NAME_FIRST_TO_CLOSE.concat("-").concat(subgraphDeploymentID);
    let entityStats = createOrLoadEntityStats();
    let badgeDefinition = createOrLoadBadgeDefinition(
      BADGE_NAME_FIRST_TO_CLOSE,
      BADGE_URL_HANDLE_FIRST_TO_CLOSE,
      BADGE_DESCRIPTION_FIRST_TO_CLOSE,
      BigInt.fromI32(BADGE_VOTE_POWER_FIRST_TO_CLOSE),
      "TBD",
      "TBD"
    );
    incrementBadgeCount(badgeDefinition.id);

    // FirstToCloseBadge hasn't been awarded for this subgraphDeploymentId yet
    // Award to this indexer
    firstToClose = new BadgeAward(badgeID);
    firstToClose.winner = indexer;
    firstToClose.awardedAt = createAwardedAtBlock(firstToClose as BadgeAward, blockNumber).id;
    firstToClose.definition = badgeDefinition.id;
    firstToClose.badgeNumber = badgeDefinition.badgeCount;
    firstToClose.save();

    entityStats.save();

    addVotingPower(indexer, badgeDefinition.votingPower);
  }
}

export function createOrLoadBadgeDefinition(
  name: string,
  urlHandle: string,
  description: string,
  voteWeight: BigInt,
  image: string,
  artist: string
): BadgeDefinition {
  let badgeDefinition = BadgeDefinition.load(name);

  if (badgeDefinition == null) {
    let protocol = createOrLoadTheGraphProtocol();

    badgeDefinition = new BadgeDefinition(name);
    badgeDefinition.protocol = protocol.id;
    badgeDefinition.description = description;
    badgeDefinition.image = image;
    badgeDefinition.artist = artist;
    badgeDefinition.urlHandle = urlHandle;
    badgeDefinition.votingPower = voteWeight;
    badgeDefinition.badgeCount = 0;

    badgeDefinition.save();
  }

  return badgeDefinition as BadgeDefinition;
}

export function incrementBadgeCount(badgeName: string): BadgeDefinition {
  let badgeDefinition = BadgeDefinition.load(badgeName);
  badgeDefinition.badgeCount = badgeDefinition.badgeCount + 1;
  badgeDefinition.save();

  return badgeDefinition as BadgeDefinition;
}

export function createOrLoadTheGraphProtocol(): Protocol {
  let protocol = Protocol.load(PROTOCOL_NAME_THE_GRAPH);

  if (protocol == null) {
    protocol = new Protocol(PROTOCOL_NAME_THE_GRAPH);
    protocol.urlHandle = PROTOCOL_URL_HANDLE_THE_GRAPH;
    protocol.description = PROTOCOL_DESCRIPTION_THE_GRAPH;
    protocol.website = PROTOCOL_WEBSITE_THE_GRAPH;
    protocol.save();
  }

  return protocol as Protocol;
}

export function createAwardedAtBlock(badgeAward: BadgeAward, blockNumber: BigInt): AwardedAt {
  let awardedAt = new AwardedAt(badgeAward.id);
  awardedAt.type = AWARDED_AT_TYPE_BLOCK;
  awardedAt.value = blockNumber;
  awardedAt.badgeAward = badgeAward.id;
  awardedAt.save();
  return awardedAt as AwardedAt;
}

export function createAwardedAtEra(badgeAward: BadgeAward, era: BigInt): AwardedAt {
  let awardedAt = new AwardedAt(badgeAward.id);
  awardedAt.type = AWARDED_AT_TYPE_ERA;
  awardedAt.value = era;
  awardedAt.badgeAward = badgeAward.id;
  awardedAt.save();
  return awardedAt as AwardedAt;
}

export function loadAwardedAtBlock(badgeAward: BadgeAward): AwardedAt {
  return AwardedAt.load(badgeAward.id) as AwardedAt;
}

function _createTestBadgeAwards(): void {
  _createTestBadgeAwardsForAddress(addresses.badgethDAO);
  _createTestBadgeAwardsForAddress(addresses.snapshotAdmin1);
  _createTestBadgeAwardsForAddress(addresses.snapshotAdmin2);
}

function _createTestBadgeAwardsForAddress(address: string): void {
  createFirstToCloseBadge("dummyid", address, BigInt.fromI32(420000));
  createNeverSlashedBadge(address, BigInt.fromI32(42));
  create28EpochsLaterBadge(address, BigInt.fromI32(42));
  let delegator = createOrLoadDelegator(address);
  createDelegationNationBadge(delegator, BigInt.fromI32(420000));
  createOrLoadDelegationStreakBadge(delegator, BigInt.fromI32(420000));
}
