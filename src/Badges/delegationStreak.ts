import { Delegator } from "../../generated/schema";
import { StakeDelegated, StakeDelegatedLocked } from "../../generated/Staking/Staking";
import {
  createOrLoadDelegator,
  createOrLoadDelegatedStake,
  createOrLoadDelegationStreakBadge,
  delegatedStakeExists
} from "../helpers/models";
import { toBigInt } from "../helpers/typeConverter";
import { processUniqueDelegation } from "../Badges/delegationNation";
import { log, BigInt } from '@graphprotocol/graph-ts'



export function processStakeDelegatedForDelegationStreakBadge(
  event: StakeDelegated
): void {
  let delegatorId = event.params.delegator.toHexString();
  let indexerId = event.params.indexer.toHexString();
  let shares = event.params.shares;
  let blockNumber = event.block.number;
  _processStakeDelegated(delegatorId, indexerId, shares, blockNumber);
}

export function processStakeDelegatedLockedForDelegationStreakBadge(
  event: StakeDelegatedLocked
): void {
  let delegatorId = event.params.delegator.toHexString();
  let indexerId = event.params.indexer.toHexString();
  let shares = event.params.shares;
  let blockNumber = event.block.number;
  _processStakeDelegatedLocked(delegatorId, indexerId, shares, blockNumber);
}

function _processStakeDelegated(
  delegatorId: string,
  indexerId: string,
  shares: BigInt,
  blockNumber: BigInt
): void {
  log.debug("_processStakeDelegated: delegatorId - {}", [delegatorId]);

  let delegator = createOrLoadDelegator(delegatorId);
  if (delegator.streakStartBlockNumber.equals(toBigInt(-1))) {
    // start new streak
    delegator.streakStartBlockNumber = blockNumber;
    createOrLoadDelegationStreakBadge(delegator, blockNumber);
  }
  else {
    // update ongoing streak
    let badge = createOrLoadDelegationStreakBadge(delegator, delegator.streakStartBlockNumber);
    badge.lastCheckpointBlockNumber = blockNumber;
    badge.save();
  }

  if (delegatedStakeExists(delegatorId, indexerId) == false) {
    // let delegationNation know that a unique Delegation was found
    processUniqueDelegation(delegator, blockNumber);
      
    delegator.uniqueActiveDelegationCount = delegator.uniqueActiveDelegationCount + 1;
  }

  let delegatedStake = createOrLoadDelegatedStake(delegatorId, indexerId);
  delegatedStake.shares = delegatedStake.shares.plus(shares);
  delegator.save();
}

function _processStakeDelegatedLocked(
  delegatorId: string,
  indexerId: string,
  shares: BigInt,
  blockNumber: BigInt
): void {
  log.debug("_processStakeDelegatedLocked: delegatorId - {}", [delegatorId]);

  let delegator = createOrLoadDelegator(delegatorId);
  let delegatedStake = createOrLoadDelegatedStake(delegatorId, indexerId);
  delegatedStake.shares = delegatedStake.shares.minus(shares);
  if (delegatedStake.shares.equals(toBigInt(0))) {
    // streak is over
    delegator.streakStartBlockNumber = toBigInt(-1);
    delegator.uniqueActiveDelegationCount = delegator.uniqueActiveDelegationCount - 1;
    _finalizeDelegationStreak(delegator, blockNumber);
  }
  delegator.save();
  delegatedStake.save();
}

function _finalizeDelegationStreak(delegator: Delegator, blockNumber: BigInt): void {
  log.debug("_finalizeDelegationStreak: streak ended for delegatorId - {}", [delegator.id]);

  let badge = createOrLoadDelegationStreakBadge(delegator, delegator.streakStartBlockNumber);
  badge.blockAwarded = blockNumber;
  badge.lastCheckpointBlockNumber = blockNumber;
  badge.save();
}

