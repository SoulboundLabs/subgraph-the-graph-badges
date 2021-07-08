import { Delegator } from "../../generated/schema";
import { StakeDelegated, StakeDelegatedLocked } from "../../generated/Staking/Staking";
import {
  createOrLoadDelegator,
  createOrLoadDelegatedStake,
  createOrLoadDelegationStreakBadge,
  delegatedStakeExists,
  addVotingPower, loadAwardedAtBlock
} from "../helpers/models";
import { toBigInt } from "../helpers/typeConverter";
import { processUniqueDelegation } from "../Badges/delegationNation";
import { log, BigInt, BigDecimal } from '@graphprotocol/graph-ts'
import { 
  BADGE_VOTE_POWER_DELEGATION_STREAK,
  minimumDelegationStreak,
  zeroBI
} from "../helpers/constants";



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
  if (delegator.streakStartBlockNumber.equals(zeroBI())) {
    // start new streak
    delegator.streakStartBlockNumber = blockNumber;
  }
  else if (blockNumber.minus(delegator.streakStartBlockNumber).gt(minimumDelegationStreak())) {
    // create ongoing award
    createOrLoadDelegationStreakBadge(delegator, delegator.streakStartBlockNumber);
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
  let awardedAt = loadAwardedAtBlock(badge);
  if (awardedAt != null) {
    awardedAt.value = blockNumber;
    awardedAt.save();
  }

  // todo: add more voting power for longer delegation streaks
  addVotingPower(delegator.id, BigInt.fromI32(BADGE_VOTE_POWER_DELEGATION_STREAK));
}

