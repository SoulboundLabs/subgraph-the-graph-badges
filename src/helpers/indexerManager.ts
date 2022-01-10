import { Allocation, Indexer, SubgraphAllocation, TokenLockWallet } from "../../generated/schema";
import {
  createOrLoadEntityStats,
  createOrLoadGraphAccount,
  BadgeAwardEventData,
} from "../helpers/models";
import {
  AllocationClosed,
  AllocationCreated,
  RebateClaimed,
  DelegationParametersUpdated, 
  AllocationCollected
} from "../../generated/Staking/Staking";
import { RewardsAssigned } from "../../generated/RewardsManager/RewardsManager";
import { BigInt } from "@graphprotocol/graph-ts/index";
import { log } from "@graphprotocol/graph-ts";
import { incrementProgressForTrack, updateProgressForTrack } from "../Badges/standardTrackBadges";
import { 
  BADGE_TRACK_INDEXER_SUBGRAPHS, 
  BADGE_TRACK_INDEXER_QUERY_FEE, 
  BADGE_TRACK_INDEXER_ALLOCATIONS_OPENED,
  zeroBI 
} from "./constants";
import { beneficiaryIfLockWallet } from "../mappings/graphTokenLockWallet";

////////////////      Public

export function processAllocationCreated(event: AllocationCreated): void {
  let eventData = new BadgeAwardEventData(event, null);
  let indexerId = beneficiaryIfLockWallet(event.params.indexer.toHexString());
  _processAllocationCreated(
    event.params.allocationID.toHexString(),
    event.params.subgraphDeploymentID.toHexString(),
    indexerId,
    event.params.epoch,
    eventData
  );
}

export function processAllocationClosed(event: AllocationClosed): void {
  let eventData = new BadgeAwardEventData(event, null);
  _processAllocationClosed(
    event.params.allocationID.toHexString(),
    event.params.subgraphDeploymentID.toHex(),
    event.params.epoch,
    eventData
  );
}

export function processAllocationCollected(event: AllocationCollected): void {
  let eventData = new BadgeAwardEventData(event, null);
  let indexerId = beneficiaryIfLockWallet(event.params.indexer.toHexString());
  _processAllocationCollected(
    indexerId,
    event.params.rebateFees,
    eventData
  );
}

export function processRebateClaimed(event: RebateClaimed): void {
  let indexerId = beneficiaryIfLockWallet(event.params.indexer.toHexString());
  _processRebateClaimed(
    indexerId,
    event.params.delegationFees
  );
}

export function processDelegationParametersUpdated(event: DelegationParametersUpdated): void {
  let indexerId = beneficiaryIfLockWallet(event.params.indexer.toHexString());
  let eventData = new BadgeAwardEventData(event, null);
  _processDelegationParametersUpdated(
    indexerId, 
    event.params.indexingRewardCut.toI32(), 
    eventData
  );
}

export function processRewardsAssigned(event: RewardsAssigned): void {
  let indexerId = beneficiaryIfLockWallet(event.params.indexer.toHexString());
  let amount = event.params.amount;
  let eventData = new BadgeAwardEventData(event, null);
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
  eventData: BadgeAwardEventData
): void {
  // check if this is the first time the indexer has allocated on this subgraph
  let subgraphAllocationId = indexerId.concat("-").concat(subgraphDeploymentId);
  let subgraphAllocation = SubgraphAllocation.load(subgraphAllocationId);
  if (subgraphAllocation == null) {
    // first time indexer has allocated on this subgraph
    _createSubgraphAllocation(indexerId, subgraphDeploymentId)
    incrementProgressForTrack(BADGE_TRACK_INDEXER_SUBGRAPHS, indexerId, eventData);
  }

  // keep track of unique allocation
  _createAllocation(channelId, subgraphDeploymentId, indexerId, epoch);
  let indexer = createOrLoadIndexer(indexerId, eventData);
  indexer.uniqueOpenAllocationCount = indexer.uniqueOpenAllocationCount + 1;
  indexer.save();

  incrementProgressForTrack(BADGE_TRACK_INDEXER_ALLOCATIONS_OPENED, indexerId, eventData);
}

function _processAllocationClosed(
  channelId: string,
  subgraphDeploymentID: string,
  epoch: BigInt,
  eventData: BadgeAwardEventData
): void {
  let allocation = Allocation.load(channelId) as Allocation;
  allocation.closedAtEpoch = epoch;
  allocation.save();
  
  let indexer = createOrLoadIndexer(allocation.indexer, eventData);
  indexer.uniqueOpenAllocationCount = indexer.uniqueOpenAllocationCount - 1;
  indexer.save();
}

function _processAllocationCollected(
  indexerId: string,
  rebateFees: BigInt,
  eventData: BadgeAwardEventData
): void {
  let indexer = createOrLoadIndexer(indexerId, eventData);
  indexer.queryFeesCollected = indexer.queryFeesCollected.plus(rebateFees);
  indexer.save();

  updateProgressForTrack(
    BADGE_TRACK_INDEXER_QUERY_FEE,
    indexerId,
    indexer.queryFeesCollected,
    eventData
  );
}

function _processDelegationParametersUpdated(
  indexerId: string,
  indexingRewardCut: number,
  eventData: BadgeAwardEventData
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
  eventData: BadgeAwardEventData
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
  // updateProgressForTrack(BADGE_TRACK_INDEXER_DISTRIBUTING, indexerId, indexer.delegatorIndexingRewards, eventData);
  indexer.delegatedTokens = indexer.delegatedTokens.plus(delegatorIndexingRewards);
  indexer.save();
}

////////////////      Models
export function createOrLoadIndexer(
  id: string,
  eventData: BadgeAwardEventData
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
    indexer.queryFeesCollected = zeroBI();
    indexer.save();

    let entityStats = createOrLoadEntityStats();
    entityStats.indexerCount = entityStats.indexerCount + 1;
    entityStats.save();
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
