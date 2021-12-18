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
// import { processUniqueDelegationForDelegationNationBadge } from "../Badges/delegationNation";
import { BigInt } from "@graphprotocol/graph-ts";
// import { processNewDelegatorForDelegatorTribeBadge } from "../Badges/delegationTribe";
import { createOrLoadIndexer } from "./indexerManager";
import { BADGE_TRACK_DELEGATOR_INDEXERS, BADGE_TRACK_INDEXER_DELEGATOR_COUNT, zeroBI } from "./constants";
import { incrementProgressForTrack, updateProgressForTrack } from "../Badges/standardTrackBadges";

////////////////      Public

export function processStakeDelegated(event: StakeDelegated): void {
  let delegatorId = event.params.delegator.toHexString();
  let indexerId = event.params.indexer.toHexString();
  let tokens = event.params.tokens;
  let eventData = new EventDataForBadgeAward(event);
  _processStakeDelegated(delegatorId, indexerId, tokens, eventData);
}

export function processStakeDelegatedLocked(event: StakeDelegatedLocked): void {
  let delegatorId = event.params.delegator.toHexString();
  let indexerId = event.params.indexer.toHexString();
  let tokens = event.params.tokens;
  let eventData = new EventDataForBadgeAward(event);
  _processStakeDelegatedLocked(delegatorId, indexerId, tokens, eventData);
}

////////////////      Event Processing

function _processStakeDelegated(
  delegatorId: string,
  indexerId: string,
  tokens: BigInt,
  eventData: EventDataForBadgeAward
): void {
  createOrLoadDelegator(delegatorId);
  let indexer = createOrLoadIndexer(indexerId, eventData);
  indexer.delegatedTokens = indexer.delegatedTokens.plus(tokens);
  indexer.save();

  let delegatedStake = createOrLoadDelegatedStake(delegatorId, indexerId, eventData);
  let oldDelegatedTokens = delegatedStake.tokens;
  delegatedStake.tokens = delegatedStake.tokens.plus(tokens);
  delegatedStake.save();
  if (oldDelegatedTokens.lt(BigInt.fromI32(1000)) 
  && delegatedStake.tokens.ge(BigInt.fromI32(1000))
  && !delegatedStake.crossed1000) {
    delegatedStake.crossed1000 = true;
    delegatedStake.save();
    incrementProgressForTrack(BADGE_TRACK_DELEGATOR_INDEXERS, delegatorId, eventData);
  }
}

function _processStakeDelegatedLocked(
  delegatorId: string,
  indexerId: string,
  tokens: BigInt,
  eventData: EventDataForBadgeAward
): void {
  let indexer = createOrLoadIndexer(indexerId, eventData);
  indexer.delegatedTokens = indexer.delegatedTokens.minus(tokens)
  indexer.save();

  let delegatedStake = createOrLoadDelegatedStake(delegatorId, indexerId, eventData);
  delegatedStake.tokens = delegatedStake.tokens.minus(tokens);
  delegatedStake.save();
}


////////////////      Models

export function createOrLoadDelegator(id: string): Delegator {
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
  }

  return delegator as Delegator;
}

export function createOrLoadDelegatedStake(
  delegatorId: string,
  indexerId: string,
  eventData: EventDataForBadgeAward
): DelegatedStake {
  let id = delegatorId.concat("-").concat(indexerId);
  let delegatedStake = DelegatedStake.load(id);

  if (delegatedStake == null) {
    delegatedStake = new DelegatedStake(id);
    delegatedStake.delegator = delegatorId;
    delegatedStake.indexer = indexerId;
    delegatedStake.tokens = zeroBI();
    delegatedStake.crossed1000 = false;
    delegatedStake.save();

    incrementProgressForTrack(BADGE_TRACK_INDEXER_DELEGATOR_COUNT, indexerId, eventData);
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
