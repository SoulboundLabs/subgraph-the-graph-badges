import { BigInt, log } from "@graphprotocol/graph-ts";
import { BadgeDefinition, Winner } from "../../generated/schema";
import {
  BADGE_DESCRIPTION_DELEGATION_STREAK,
  BADGE_NAME_DELEGATION_STREAK,
  BADGE_STREAK_MIN_BLOCKS_DELEGATION_STREAK,
  BADGE_VOTE_POWER_DELEGATION_STREAK,
  negOneBI,
} from "../helpers/constants";
import {
  createOrLoadDelegatedStake,
  createOrLoadDelegator,
} from "../helpers/delegationManager";
import {
  createBadgeAward,
  createOrLoadBadgeDefinitionWithStreak,
} from "../helpers/models";
import {
  createOrLoadOngoingBadgeStreak,
  endBadgeStreak,
} from "../helpers/streakManager";
import { toBigInt } from "../helpers/typeConverter";

export function processStakeDelegatedForDelegationStreakBadge(
  delegatorId: string,
  indexerId: string,
  shares: BigInt,
  blockNumber: BigInt
): void {
  log.debug("_processStakeDelegated: delegatorId - {}", [delegatorId]);

  let delegator = createOrLoadDelegator(delegatorId);
  let ongoingBadgeStreak = createOrLoadOngoingBadgeStreak(
    BADGE_NAME_DELEGATION_STREAK,
    delegatorId
  );
  if (ongoingBadgeStreak.streakStartBlock.equals(negOneBI())) {
    ongoingBadgeStreak.streakStartBlock = blockNumber;
    ongoingBadgeStreak.save();
  }

  let delegatedStake = createOrLoadDelegatedStake(delegatorId, indexerId);
  delegatedStake.shares = delegatedStake.shares.plus(shares);
  delegatedStake.save();
  delegator.save();
}

export function processStakeDelegatedLockedForDelegationStreakBadge(
  delegatorId: string,
  indexerId: string,
  shares: BigInt
): void {
  log.debug("_processStakeDelegatedLocked: delegatorId - {}", [delegatorId]);

  let delegator = createOrLoadDelegator(delegatorId);
  let delegatedStake = createOrLoadDelegatedStake(delegatorId, indexerId);
  delegatedStake.shares = delegatedStake.shares.minus(shares);
  if (delegatedStake.shares.equals(toBigInt(0))) {
    delegator.uniqueActiveDelegationCount =
      delegator.uniqueActiveDelegationCount - 1;
    delegator.save();

    // end streak if delegator just closed last delegation
    if (delegator.uniqueActiveDelegationCount == 0) {
      endBadgeStreak(BADGE_NAME_DELEGATION_STREAK, delegatorId);
    }
  }
  delegatedStake.save();
}

// awards a badge if there's an ongoing streak and minimum threshold was passed since last sync
export function updateDelegationStreak(
  winner: Winner,
  blockNumber: BigInt
): void {
  let ongoingBadgeStreak = createOrLoadOngoingBadgeStreak(
    BADGE_NAME_DELEGATION_STREAK,
    winner.id
  );
  if (ongoingBadgeStreak.streakStartBlock.notEqual(negOneBI())) {
    let streakLength = blockNumber.minus(ongoingBadgeStreak.streakStartBlock);
    let previousStreakLength = winner.lastSyncBlockNumber;
    let minimumBlocks = BigInt.fromI32(
      BADGE_STREAK_MIN_BLOCKS_DELEGATION_STREAK
    );
    if (
      streakLength.ge(minimumBlocks) &&
      previousStreakLength.lt(minimumBlocks)
    ) {
      createBadgeAward(_badgeDefinition(), winner.id, blockNumber);
    }
  }
}

function _badgeDefinition(): BadgeDefinition {
  return createOrLoadBadgeDefinitionWithStreak(
    BADGE_NAME_DELEGATION_STREAK,
    BADGE_DESCRIPTION_DELEGATION_STREAK,
    BigInt.fromI32(BADGE_VOTE_POWER_DELEGATION_STREAK),
    "TBD",
    "TBD",
    BigInt.fromI32(BADGE_STREAK_MIN_BLOCKS_DELEGATION_STREAK)
  ) as BadgeDefinition;
}
