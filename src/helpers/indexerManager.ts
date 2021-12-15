import { Allocation, Indexer, SubgraphAllocation } from "../../generated/schema";
import {
  createOrLoadEntityStats,
  createOrLoadGraphAccount,
  EventDataForBadgeAward,
} from "../helpers/models";
import {
  AllocationClosed,
  AllocationCreated,
  RebateClaimed,
  DelegationParametersUpdated
} from "../../generated/Staking/Staking";
import { RewardsAssigned } from "../../generated/RewardsManager/RewardsManager";
import { BigInt } from "@graphprotocol/graph-ts/index";
import { log } from "@graphprotocol/graph-ts";
import { processAllocationClosedForFirstToCloseBadge } from "../Badges/firstToClose";
import { incrementProgressForTrack, updateProgressForTrack } from "../Badges/standardTrackBadges";
import { BADGE_TRACK_INDEXING, BADGE_TRACK_YIELD, zeroBI } from "./constants";

////////////////      Public

export function processAllocationCreated(event: AllocationCreated): void {
  let eventData = new EventDataForBadgeAward(event);
  _processAllocationCreated(
    event.params.allocationID.toHexString(),
    event.params.subgraphDeploymentID.toHexString(),
    event.params.indexer.toHexString(),
    event.params.epoch,
    eventData
  );
}

export function processAllocationClosed(event: AllocationClosed): void {
  let eventData = new EventDataForBadgeAward(event);
  _processAllocationClosed(
    event.params.allocationID.toHexString(),
    event.params.subgraphDeploymentID.toHex(),
    event.params.epoch,
    eventData
  );
}

export function processRebateClaimed(event: RebateClaimed): void {
  _processRebateClaimed(
    event.params.indexer.toHexString(),
    event.params.delegationFees
  );
}

export function processDelegationParametersUpdated(event: DelegationParametersUpdated): void {
  let indexerId = event.params.indexer.toHexString();
  let rewardCut = event.params.indexingRewardCut.toI32();
  let eventData = new EventDataForBadgeAward(event);
  _processDelegationParametersUpdated(indexerId, rewardCut, eventData);
}

export function processRewardsAssigned(event: RewardsAssigned): void {
  let indexerId = event.params.indexer.toHexString();
  let amount = event.params.amount;
  let eventData = new EventDataForBadgeAward(event);
  _processRewardsAssigned(
    indexerId,
    amount,
    eventData
  );
}

////////////////      Event Processing

function _processAllocationCreated(
  channelId: string,
  subgraphDeploymentId: string,
  indexerId: string,
  epoch: BigInt,
  eventData: EventDataForBadgeAward
): void {
  // check if this is the first time the indexer has allocated on this subgraph
  let subgraphAllocationId = indexerId.concat("-").concat(subgraphDeploymentId);
  let subgraphAllocation = SubgraphAllocation.load(subgraphAllocationId);
  if (subgraphAllocation == null) {
    // first time indexer has allocated on this subgraph
    _createSubgraphAllocation(indexerId, subgraphDeploymentId)
    incrementProgressForTrack(BADGE_TRACK_INDEXING, indexerId, eventData);
  }

  // keep track of unique allocation
  _createAllocation(channelId, subgraphDeploymentId, indexerId, epoch);
  let indexer = createOrLoadIndexer(indexerId, eventData);
  indexer.uniqueOpenAllocationCount = indexer.uniqueOpenAllocationCount + 1;
  indexer.save();

  _broadcastAllocationCreated(indexer, eventData);
}

function _processAllocationClosed(
  channelId: string,
  subgraphDeploymentID: string,
  epoch: BigInt,
  eventData: EventDataForBadgeAward
): void {
  let allocation = Allocation.load(channelId) as Allocation;
  allocation.closedAtEpoch = epoch;
  allocation.save();
  
  let indexer = createOrLoadIndexer(allocation.indexer, eventData);
  indexer.uniqueOpenAllocationCount = indexer.uniqueOpenAllocationCount - 1;
  indexer.save();
}

function _processDelegationParametersUpdated(
  indexerId: string,
  indexingRewardCut: number,
  eventData: EventDataForBadgeAward
): void {
  let indexer = createOrLoadIndexer(indexerId, eventData);
  indexer.indexingRewardCut = indexingRewardCut as i32;
  indexer.save();
}

function _processRebateClaimed(
  indexerId: string,
  tokens: BigInt
): void {
  let indexer = Indexer.load(indexerId) as Indexer;
  indexer.delegatedTokens = indexer.delegatedTokens.plus(tokens);
  indexer.save();
}

function _processRewardsAssigned(
  indexerId: string,
  amount: BigInt,
  eventData: EventDataForBadgeAward
): void {
  let indexer = createOrLoadIndexer(indexerId, eventData);

  // If the delegation pool has zero tokens, the contracts don't give away any rewards
  let indexerIndexingRewards =
    indexer.delegatedTokens == BigInt.fromI32(0)
      ? amount
      : amount
          .times(BigInt.fromI32(indexer.indexingRewardCut))
          .div(BigInt.fromI32(1000000));

  let delegatorIndexingRewards = amount.minus(indexerIndexingRewards);
  indexer.delegatorIndexingRewards = indexer.delegatorIndexingRewards.plus(delegatorIndexingRewards);
  updateProgressForTrack(BADGE_TRACK_YIELD, indexerId, indexer.delegatorIndexingRewards, eventData);
  indexer.delegatedTokens = indexer.delegatedTokens.plus(delegatorIndexingRewards);
  indexer.save();
}

////////////////      Broadcasting

function _broadcastAllocationCreated(
  indexer: Indexer,
  eventData: EventDataForBadgeAward
): void {
}

function _broadcastAllocationClosedOnTime(
  allocation: Allocation,
  subgraphDeploymentID: string,
  eventData: EventDataForBadgeAward
): void {
  processAllocationClosedForFirstToCloseBadge(
    allocation,
    subgraphDeploymentID,
    eventData
  );
}

function _broadcastUniqueIndexerCreated(
  indexerId: string,
  eventData: EventDataForBadgeAward
): void {
}

////////////////      Models
export function createOrLoadIndexer(
  id: string,
  eventData: EventDataForBadgeAward
): Indexer {
  log.debug("Loading indexer with id: {}", [id]);

  let indexer = Indexer.load(id);

  if (indexer == null) {
    createOrLoadGraphAccount(id);
    indexer = new Indexer(id);
    indexer.account = id;
    indexer.uniqueOpenAllocationCount = 0;
    indexer.uniqueSubgraphAllocationCount = 0;
    indexer.allocationsClosedOnTime = 0;
    indexer.delegatedTokens = zeroBI();
    indexer.delegatorIndexingRewards = zeroBI();
    indexer.indexingRewardCut = 0;
    indexer.save();

    let entityStats = createOrLoadEntityStats();
    entityStats.indexerCount = entityStats.indexerCount + 1;
    entityStats.save();

    _broadcastUniqueIndexerCreated(id, eventData);
  }

  return indexer as Indexer;
}

function _createAllocation(
  channelId: string,
  subgraphDeploymentId: string,
  indexerID: string,
  epochCreated: BigInt
): Allocation {
  let allocation = new Allocation(channelId);
  allocation.createdAtEpoch = epochCreated;
  allocation.indexer = indexerID;
  allocation.subgraph = subgraphDeploymentId;
  allocation.save();

  return allocation;
}

function _createSubgraphAllocation(
  indexerId: string,
  subgraphDeploymentId: string
): SubgraphAllocation {
  let id = indexerId.concat("-").concat(subgraphDeploymentId);
  let subgraphAllocation = new SubgraphAllocation(id);
  subgraphAllocation.indexer = indexerId;
  subgraphAllocation.subgraph = subgraphDeploymentId;
  subgraphAllocation.save();

  return subgraphAllocation;
}
