import { Allocation, Indexer } from "../../generated/schema";
import {
  createOrLoadEntityStats,
  createOrLoadGraphAccount,
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

////////////////      Public

export function processAllocationCreated(event: AllocationCreated): void {
  _processAllocationCreated(
    event.params.allocationID.toHexString(),
    event.params.subgraphDeploymentID.toHexString(),
    event.params.indexer.toHexString(),
    event.params.epoch,
    event.block.number
  );
}

export function processAllocationClosed(event: AllocationClosed): void {
  _processAllocationClosed(
    event.params.allocationID.toHexString(),
    event.params.subgraphDeploymentID.toHex(),
    event.params.indexer.toHexString(),
    event.params.epoch,
    event.block.number
  );
}

export function processStakeSlashed(event: StakeSlashed): void {
  _processStakeSlashed(
    event.params.indexer.toHexString(),
    event.params.beneficiary.toHexString(),
    event.block.number
  );
}

////////////////      Event Processing

function _processAllocationCreated(
  channelId: string,
  subgraphDeploymentId: string,
  indexerId: string,
  epoch: BigInt,
  blockNumber: BigInt
): void {
  syncAllStreaksForWinner(indexerId, blockNumber);
  _createAllocation(channelId, subgraphDeploymentId, indexerId, epoch);
  let indexer = createOrLoadIndexer(indexerId);
  indexer.uniqueOpenAllocationCount = indexer.uniqueOpenAllocationCount + 1;
  indexer.save();

  _broadcastAllocationCreated(indexer, blockNumber);
}

function _processAllocationClosed(
  channelId: string,
  subgraphDeploymentID: string,
  indexerId: string,
  epoch: BigInt,
  blockNumber: BigInt
): void {
  syncAllStreaksForWinner(indexerId, blockNumber);

  let allocation = Allocation.load(channelId) as Allocation;
  let indexer = createOrLoadIndexer(allocation.indexer);

  indexer.uniqueOpenAllocationCount = indexer.uniqueOpenAllocationCount - 1;

  if (epoch.minus(allocation.createdAtEpoch).le(BigInt.fromI32(28))) {
    indexer.allocationsClosedOnTime = indexer.allocationsClosedOnTime + 1;
    _broadcastAllocationClosedOnTime(
      allocation,
      subgraphDeploymentID,
      blockNumber
    );
  }

  indexer.save();
}

function _processStakeSlashed(
  indexerId: string,
  beneficiaryId: string,
  blockNumber: BigInt
): void {
  syncAllStreaksForWinners([indexerId, beneficiaryId], blockNumber);
  _broadcastStakeSlashed(indexerId, blockNumber);
}

////////////////      Broadcasting

function _broadcastAllocationCreated(indexer: Indexer, epoch: BigInt): void {
  processAllocationCreatedForNeverSlashed(indexer, epoch);
}

function _broadcastAllocationClosedOnTime(
  allocation: Allocation,
  subgraphDeploymentID: string,
  blockNumber: BigInt
): void {
  processAllocationClosedOnTimeFor28DaysLaterBadge(allocation, blockNumber);
  processAllocationClosedForFirstToCloseBadge(
    allocation,
    subgraphDeploymentID,
    blockNumber
  );
}

function _broadcastStakeSlashed(indexerId: string, blockNumber: BigInt): void {
  processStakeSlashedForNeverSlashedBadge(indexerId, blockNumber);
}

////////////////      Models

export function createOrLoadIndexer(id: string): Indexer {
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
