import { Delegator, DelegatedStake } from "../../generated/schema";
import {
  StakeDelegated,
  StakeDelegatedLocked,
} from "../../generated/Staking/Staking";
import {
  createOrLoadEntityStats,
  createOrLoadGraphAccount,
  BadgeAwardEventData,
  BadgeAwardEventMetadata
} from "../helpers/models";
import { BigInt } from "@graphprotocol/graph-ts";
import { createOrLoadIndexer } from "./indexerManager";
import { BADGE_TRACK_DELEGATOR_INDEXERS, BADGE_TRACK_INDEXER_DELEGATOR_COUNT, zeroBI, BADGE_AWARD_METADATA_NAME_DELEGATOR, BADGE_AWARD_METADATA_NAME_TOKENS } from "./constants";
import { incrementProgressForTrack } from "../Badges/standardTrackBadges";
import { beneficiaryIfLockWallet } from "../mappings/graphTokenLockWallet";

////////////////      Public

export function processStakeDelegated(event: StakeDelegated): void {
  let delegatorId = beneficiaryIfLockWallet(event.params.delegator.toHexString());
  let indexerId = beneficiaryIfLockWallet(event.params.indexer.toHexString());
  let tokens = event.params.tokens;
  let metadata: Array<BadgeAwardEventMetadata> = [
    new BadgeAwardEventMetadata(BADGE_AWARD_METADATA_NAME_DELEGATOR, delegatorId),
    new BadgeAwardEventMetadata(BADGE_AWARD_METADATA_NAME_TOKENS, tokens.toString())
  ];
  let eventData = new BadgeAwardEventData(event, metadata);
  _processStakeDelegated(delegatorId, indexerId, tokens, eventData);
}

export function processStakeDelegatedLocked(event: StakeDelegatedLocked): void {
  let delegatorId = beneficiaryIfLockWallet(event.params.delegator.toHexString());
  let indexerId = beneficiaryIfLockWallet(event.params.indexer.toHexString());
  let tokens = event.params.tokens;
  let eventData = new BadgeAwardEventData(event, null);
  _processStakeDelegatedLocked(delegatorId, indexerId, tokens, eventData);
}

////////////////      Event Processing

function _processStakeDelegated(
  delegatorId: string,
  indexerId: string,
  tokens: BigInt,
  eventData: BadgeAwardEventData
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
  eventData: BadgeAwardEventData
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
  eventData: BadgeAwardEventData
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
