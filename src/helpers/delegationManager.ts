import { Delegator, DelegatedStake } from "../../generated/schema";
import {
  StakeDelegated,
  StakeDelegatedLocked,
} from "../../generated/Staking/Staking";
import {
  createOrLoadEntityStats,
  createOrLoadGraphAccount,
} from "../helpers/models";
import { toBigInt } from "../helpers/typeConverter";
import { processUniqueDelegationForDelegationNationBadge } from "../Badges/delegationNation";
import { BigInt } from "@graphprotocol/graph-ts";
import {
  processStakeDelegatedForDelegationStreakBadge,
  processStakeDelegatedLockedForDelegationStreakBadge,
} from "../Badges/delegationStreak";
import { syncAllStreaksForWinners } from "./streakManager";
import { processNewDelegatorForDelegatorTribeBadge } from "../Badges/delegationTribe";

////////////////      Public

export function processStakeDelegated(event: StakeDelegated): void {
  let delegatorId = event.params.delegator.toHexString();
  let indexerId = event.params.indexer.toHexString();
  let shares = event.params.shares;
  let blockNumber = event.block.number;
  _processStakeDelegated(delegatorId, indexerId, shares, blockNumber);
}

export function processStakeDelegatedLocked(event: StakeDelegatedLocked): void {
  let delegatorId = event.params.delegator.toHexString();
  let indexerId = event.params.indexer.toHexString();
  let shares = event.params.shares;
  let blockNumber = event.block.number;
  _processStakeDelegatedLocked(delegatorId, indexerId, shares, blockNumber);
}

////////////////      Event Processing

function _processStakeDelegated(
  delegatorId: string,
  indexerId: string,
  shares: BigInt,
  blockNumber: BigInt
): void {
  syncAllStreaksForWinners([delegatorId, indexerId], blockNumber);

  if (_delegatedStakeExists(delegatorId, indexerId) == false) {
    createOrLoadDelegatedStake(delegatorId, indexerId);
    let delegator = createOrLoadDelegator(delegatorId, blockNumber);
    delegator.uniqueActiveDelegationCount =
      delegator.uniqueActiveDelegationCount + 1;
    delegator.save();
    _broadcastUniqueDelegation(delegator, blockNumber);
  }
  _broadcastStakeDelegated(delegatorId, indexerId, shares, blockNumber);
}

function _processStakeDelegatedLocked(
  delegatorId: string,
  indexerId: string,
  shares: BigInt,
  blockNumber: BigInt
): void {
  syncAllStreaksForWinners([delegatorId, indexerId], blockNumber);

  _broadcastStakeDelegatedLocked(delegatorId, indexerId, shares, blockNumber);
}

////////////////      Broadcasting

function _broadcastUniqueDelegation(
  delegator: Delegator,
  blockNumber: BigInt
): void {
  processUniqueDelegationForDelegationNationBadge(delegator, blockNumber);
}

function _broadcastStakeDelegated(
  delegatorId: string,
  indexerId: string,
  shares: BigInt,
  blockNumber: BigInt
): void {
  processStakeDelegatedForDelegationStreakBadge(
    delegatorId,
    indexerId,
    shares,
    blockNumber
  );
}

function _broadcastStakeDelegatedLocked(
  delegatorId: string,
  indexerId: string,
  shares: BigInt,
  blockNumber: BigInt
): void {
  processStakeDelegatedLockedForDelegationStreakBadge(
    delegatorId,
    indexerId,
    shares,
    blockNumber
  );
}

////////////////      Models

export function createOrLoadDelegator(
  id: string,
  blockNumber: BigInt
): Delegator {
  let delegator = Delegator.load(id);

  if (delegator == null) {
    createOrLoadGraphAccount(id);
    delegator = new Delegator(id);
    delegator.account = id;
    delegator.uniqueActiveDelegationCount = 0;
    delegator.save();

    let entityStats = createOrLoadEntityStats();
    let delegatorCount = entityStats.delegatorCount + 1;
    entityStats.delegatorCount = delegatorCount;
    entityStats.save();

    processNewDelegatorForDelegatorTribeBadge(id, blockNumber);
  }

  return delegator as Delegator;
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

function _delegatedStakeExists(
  delegatorId: string,
  indexerId: string
): boolean {
  let id = delegatorId.concat("-").concat(indexerId);
  let delegatedStake = DelegatedStake.load(id);
  return delegatedStake != null;
}
