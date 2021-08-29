import { BigInt } from "@graphprotocol/graph-ts/index";
import { BadgeDefinition, Indexer, Winner } from "../../generated/schema";
import {
  BADGE_DESCRIPTION_NEVER_SLASHED,
  BADGE_NAME_NEVER_SLASHED,
  BADGE_STREAK_MIN_BLOCKS_NEVER_SLASHED,
  BADGE_VOTE_POWER_NEVER_SLASHED,
} from "../helpers/constants";
import {
  createBadgeAward,
  createOrLoadBadgeDefinition,
} from "../helpers/models";
import {
  createOrLoadOngoingBadgeStreak,
  endBadgeStreak,
  restartBadgeStreak,
  setBadgeStreak,
} from "../helpers/streakManager";

export function processAllocationCreatedForNeverSlashed(
  indexer: Indexer,
  epoch: BigInt
): void {
  // start a streak if indexer went from 0 allocations to 1
  if (indexer.uniqueOpenAllocationCount == 1) {
    setBadgeStreak(BADGE_NAME_NEVER_SLASHED, indexer.id, epoch);
  }
}

export function processAllocationClosedForNeverSlashed(indexer: Indexer): void {
  // end streak if indexer went from 1 allocations to 0
  if (indexer.uniqueOpenAllocationCount == 0) {
    endBadgeStreak(BADGE_NAME_NEVER_SLASHED, indexer.id);
  }
}

export function updateNeverSlashedStreak(
  winner: Winner,
  blockNumber: BigInt
): void {
  let badgeStreak = createOrLoadOngoingBadgeStreak(
    BADGE_NAME_NEVER_SLASHED,
    winner.id
  );
  let minBlocks = BigInt.fromI32(BADGE_STREAK_MIN_BLOCKS_NEVER_SLASHED);
  if (
    blockNumber.minus(badgeStreak.streakStartBlock).gt(minBlocks) &&
    winner.lastSyncBlockNumber.minus(badgeStreak.streakStartBlock).lt(minBlocks)
  ) {
    createBadgeAward(_badgeDefinition(), winner.id, blockNumber);
    restartBadgeStreak(BADGE_NAME_NEVER_SLASHED, winner.id, blockNumber);
  }
}

export function processStakeSlashedForNeverSlashedBadge(
  indexer: string,
  blockNumber: BigInt
): void {
  restartBadgeStreak(BADGE_NAME_NEVER_SLASHED, indexer, blockNumber);
}

function _badgeDefinition(): BadgeDefinition {
  return createOrLoadBadgeDefinition(
    BADGE_NAME_NEVER_SLASHED,
    BADGE_DESCRIPTION_NEVER_SLASHED,
    BigInt.fromI32(BADGE_VOTE_POWER_NEVER_SLASHED),
    "TBD",
    "TBD"
  );
}
