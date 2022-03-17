import { BigInt } from "@graphprotocol/graph-ts";
import { DelegatedStake, Delegator } from "../../generated/schema";
import {
  StakeDelegated,
  StakeDelegatedLocked,
} from "../../generated/Staking/Staking";
import {
  EarnedBadgeEventData,
  EarnedBadgeEventMetadata,
} from "../Emblem/emblemModels";
import { incrementProgress } from "../Emblem/metricProgress";
import {
  createOrLoadTheGraphEntityStats,
  createOrLoadGraphAccount,
} from "../helpers/models";
import { beneficiaryIfLockWallet } from "../mappings/graphTokenLockWallet";
import {
  BADGE_AWARD_METADATA_NAME_DELEGATOR,
  BADGE_AWARD_METADATA_NAME_TOKENS,
  BADGE_METRIC_DELEGATOR_INDEXERS_ID,
  BADGE_METRIC_INDEXER_DELEGATOR_COUNT_ID,
} from "../Emblem/metrics";
import { createOrLoadIndexer } from "./indexerManager";
import { zeroBI } from "./constants";

////////////////      Public

export function processStakeDelegated(event: StakeDelegated): void {
  let delegatorId = beneficiaryIfLockWallet(
    event.params.delegator.toHexString()
  );
  let indexerId = beneficiaryIfLockWallet(event.params.indexer.toHexString());
  let tokens = event.params.tokens;
  let metadata: Array<EarnedBadgeEventMetadata> = [
    new EarnedBadgeEventMetadata(
      BADGE_AWARD_METADATA_NAME_DELEGATOR,
      delegatorId
    ),
    new EarnedBadgeEventMetadata(
      BADGE_AWARD_METADATA_NAME_TOKENS,
      tokens.toString()
    ),
  ];
  let eventData = new EarnedBadgeEventData(event, metadata);
  _processStakeDelegated(delegatorId, indexerId, tokens, eventData);
}

export function processStakeDelegatedLocked(event: StakeDelegatedLocked): void {
  let delegatorId = beneficiaryIfLockWallet(
    event.params.delegator.toHexString()
  );
  let indexerId = beneficiaryIfLockWallet(event.params.indexer.toHexString());
  let tokens = event.params.tokens;
  let eventData = new EarnedBadgeEventData(event, []);
  _processStakeDelegatedLocked(delegatorId, indexerId, tokens, eventData);
}

////////////////      Event Processing

function _processStakeDelegated(
  delegatorId: string,
  indexerId: string,
  tokens: BigInt,
  eventData: EarnedBadgeEventData
): void {
  createOrLoadDelegator(delegatorId);
  let indexer = createOrLoadIndexer(indexerId, eventData);
  indexer.delegatedTokens = indexer.delegatedTokens.plus(tokens);
  indexer.save();

  let delegatedStake = createOrLoadDelegatedStake(
    delegatorId,
    indexerId,
    eventData
  );
  let oldDelegatedTokens = delegatedStake.tokens;
  delegatedStake.tokens = delegatedStake.tokens.plus(tokens);
  delegatedStake.save();
  if (
    oldDelegatedTokens.lt(BigInt.fromI32(100)) &&
    delegatedStake.tokens.ge(BigInt.fromI32(100)) &&
    !delegatedStake.crossed100 &&
    delegatedStake.crossed100 == false
  ) {
    delegatedStake.crossed100 = true;
    delegatedStake.save();

    incrementProgress(
      delegatorId,
      BADGE_METRIC_DELEGATOR_INDEXERS_ID,
      eventData
    );
  }
}

function _processStakeDelegatedLocked(
  delegatorId: string,
  indexerId: string,
  tokens: BigInt,
  eventData: EarnedBadgeEventData
): void {
  let indexer = createOrLoadIndexer(indexerId, eventData);
  indexer.delegatedTokens = indexer.delegatedTokens.minus(tokens);
  indexer.save();

  let delegatedStake = createOrLoadDelegatedStake(
    delegatorId,
    indexerId,
    eventData
  );
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

    let entityStats = createOrLoadTheGraphEntityStats();
    let delegatorCount = entityStats.delegatorCount + 1;
    entityStats.delegatorCount = delegatorCount;
    entityStats.save();
  }

  return delegator as Delegator;
}

export function createOrLoadDelegatedStake(
  delegatorId: string,
  indexerId: string,
  eventData: EarnedBadgeEventData
): DelegatedStake {
  let id = delegatorId.concat("-").concat(indexerId);
  let delegatedStake = DelegatedStake.load(id);

  if (delegatedStake == null) {
    delegatedStake = new DelegatedStake(id);
    delegatedStake.delegator = delegatorId;
    delegatedStake.indexer = indexerId;
    delegatedStake.tokens = zeroBI();
    delegatedStake.crossed100 = false;
    delegatedStake.save();

    incrementProgress(
      indexerId,
      BADGE_METRIC_INDEXER_DELEGATOR_COUNT_ID,
      eventData
    );
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
