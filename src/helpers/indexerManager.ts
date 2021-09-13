import { Allocation, Indexer } from "../../generated/schema";
import {
  createOrLoadEntityStats,
  createOrLoadGraphAccount,
  EventDataForBadgeAward,
} from "../helpers/models";
import {
  AllocationClosed,
  AllocationCreated,
  StakeSlashed,
} from "../../generated/Staking/Staking";
import { BigInt } from "@graphprotocol/graph-ts/index";
import { log } from "@graphprotocol/graph-ts";
import { processAllocationClosedForFirstToCloseBadge } from "../Badges/firstToClose";
import {
  processAllocationCreatedForNeverSlashed,
  processStakeSlashedForNeverSlashedBadge,
} from "../Badges/neverSlashed";
import { processAllocationClosedOnTimeFor28DaysLaterBadge } from "../Badges/28DaysLater";
import {
  syncAllStreaksForWinner,
  syncAllStreaksForWinners,
} from "./streakManager";
import { processNewIndexerForIndexerTribeBadge } from "../Badges/indexerTribe";

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
    event.params.indexer.toHexString(),
    event.params.epoch,
    eventData
  );
}

export function processStakeSlashed(event: StakeSlashed): void {
  let eventData = new EventDataForBadgeAward(event);
  _processStakeSlashed(
    event.params.indexer.toHexString(),
    event.params.beneficiary.toHexString(),
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
  syncAllStreaksForWinner(indexerId, eventData);
  _createAllocation(channelId, subgraphDeploymentId, indexerId, epoch);
  let indexer = createOrLoadIndexer(indexerId, eventData);
  indexer.uniqueOpenAllocationCount = indexer.uniqueOpenAllocationCount + 1;
  indexer.save();

  _broadcastAllocationCreated(indexer, eventData);
}

function _processAllocationClosed(
  channelId: string,
  subgraphDeploymentID: string,
  indexerId: string,
  epoch: BigInt,
  eventData: EventDataForBadgeAward
): void {
  syncAllStreaksForWinner(indexerId, eventData);

  let allocation = Allocation.load(channelId) as Allocation;
  let indexer = createOrLoadIndexer(allocation.indexer, eventData);

  indexer.uniqueOpenAllocationCount = indexer.uniqueOpenAllocationCount - 1;

  if (epoch.minus(allocation.createdAtEpoch).le(BigInt.fromI32(28))) {
    indexer.allocationsClosedOnTime = indexer.allocationsClosedOnTime + 1;
    _broadcastAllocationClosedOnTime(
      allocation,
      subgraphDeploymentID,
      eventData
    );
  }

  indexer.save();
}

function _processStakeSlashed(
  indexerId: string,
  beneficiaryId: string,
  eventData: EventDataForBadgeAward
): void {
  syncAllStreaksForWinners([indexerId, beneficiaryId], eventData);
  _broadcastStakeSlashed(indexerId, eventData);
}

////////////////      Broadcasting

function _broadcastAllocationCreated(
  indexer: Indexer,
  eventData: EventDataForBadgeAward
): void {
  processAllocationCreatedForNeverSlashed(indexer, eventData);
}

function _broadcastAllocationClosedOnTime(
  allocation: Allocation,
  subgraphDeploymentID: string,
  eventData: EventDataForBadgeAward
): void {
  processAllocationClosedOnTimeFor28DaysLaterBadge(allocation, eventData);
  processAllocationClosedForFirstToCloseBadge(
    allocation,
    subgraphDeploymentID,
    eventData
  );
}

function _broadcastStakeSlashed(
  indexerId: string,
  eventData: EventDataForBadgeAward
): void {
  processStakeSlashedForNeverSlashedBadge(indexerId, eventData);
}

function _broadcastUniqueIndexerCreated(
  indexerId: string,
  eventData: EventDataForBadgeAward
): void {
  processNewIndexerForIndexerTribeBadge(indexerId, eventData);
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
    indexer.allocationsClosedOnTime = 0;
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
