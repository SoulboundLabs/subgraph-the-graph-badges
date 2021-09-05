import { Delegator, DelegatedStake } from "../../generated/schema";
import {
  StakeDelegated,
  StakeDelegatedLocked,
} from "../../generated/Staking/Staking";
import {
  createOrLoadEntityStats,
  createOrLoadGraphAccount,
  EventDataForBadgeAward,
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
  let eventData = new EventDataForBadgeAward(event);
  _processStakeDelegated(delegatorId, indexerId, shares, eventData);
}

export function processStakeDelegatedLocked(event: StakeDelegatedLocked): void {
  let delegatorId = event.params.delegator.toHexString();
  let indexerId = event.params.indexer.toHexString();
  let shares = event.params.shares;
  let eventData = new EventDataForBadgeAward(event);
  _processStakeDelegatedLocked(delegatorId, indexerId, shares, eventData);
}

////////////////      Event Processing

function _processStakeDelegated(
  delegatorId: string,
  indexerId: string,
  shares: BigInt,
  eventData: EventDataForBadgeAward
): void {
  syncAllStreaksForWinners([delegatorId, indexerId], eventData);

  if (_delegatedStakeExists(delegatorId, indexerId) == false) {
    createOrLoadDelegatedStake(delegatorId, indexerId);
    let delegator = createOrLoadDelegator(delegatorId, eventData);
    delegator.uniqueActiveDelegationCount =
      delegator.uniqueActiveDelegationCount + 1;
    delegator.save();
    _broadcastUniqueDelegation(delegator, eventData);
  }
  _broadcastStakeDelegated(delegatorId, indexerId, shares, eventData);
}

function _processStakeDelegatedLocked(
  delegatorId: string,
  indexerId: string,
  shares: BigInt,
  eventData: EventDataForBadgeAward
): void {
  syncAllStreaksForWinners([delegatorId, indexerId], eventData);

  _broadcastStakeDelegatedLocked(delegatorId, indexerId, shares, eventData);
}

////////////////      Broadcasting

function _broadcastUniqueDelegation(
  delegator: Delegator,
  eventData: EventDataForBadgeAward
): void {
  processUniqueDelegationForDelegationNationBadge(delegator, eventData);
}

function _broadcastStakeDelegated(
  delegatorId: string,
  indexerId: string,
  shares: BigInt,
  eventData: EventDataForBadgeAward
): void {
  processStakeDelegatedForDelegationStreakBadge(
    delegatorId,
    indexerId,
    shares,
    eventData
  );
}

function _broadcastStakeDelegatedLocked(
  delegatorId: string,
  indexerId: string,
  shares: BigInt,
  eventData: EventDataForBadgeAward
): void {
  processStakeDelegatedLockedForDelegationStreakBadge(
    delegatorId,
    indexerId,
    shares,
    eventData
  );
}

////////////////      Models

export function createOrLoadDelegator(
  id: string,
  eventData: EventDataForBadgeAward
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

    processNewDelegatorForDelegatorTribeBadge(id, eventData);
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
