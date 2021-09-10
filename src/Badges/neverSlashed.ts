import { BigInt, log } from "@graphprotocol/graph-ts";
import { BadgeDefinition, Indexer, Winner } from "../../generated/schema";
import {
  BADGE_DESCRIPTION_NEVER_SLASHED,
  BADGE_NAME_NEVER_SLASHED,
  BADGE_STREAK_MIN_DAYS_NEVER_SLASHED,
  BADGE_VOTE_POWER_NEVER_SLASHED,
  negOneBI,
  PROTOCOL_ROLE_INDEXER,
} from "../helpers/constants";
import {
  createBadgeAward,
  createOrLoadBadgeDefinitionWithStreak,
  EventDataForBadgeAward,
} from "../helpers/models";
import {
  createOrLoadOngoingBadgeStreak,
  endBadgeStreak,
  setBadgeStreakStart,
} from "../helpers/streakManager";
import { daysToBlocks } from "../helpers/typeConverter";

export function processAllocationCreatedForNeverSlashed(
  indexer: Indexer,
  eventData: EventDataForBadgeAward
): void {
  // start a streak if indexer went from 0 allocations to 1
  if (indexer.uniqueOpenAllocationCount == 1) {
    setBadgeStreakStart(
      BADGE_NAME_NEVER_SLASHED,
      indexer.id,
      eventData.blockNumber
    );
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
  eventData: EventDataForBadgeAward
): void {
  let minBlocks = daysToBlocks(
    BigInt.fromI32(BADGE_STREAK_MIN_DAYS_NEVER_SLASHED)
  );
  let badgeStreak = createOrLoadOngoingBadgeStreak(
    BADGE_NAME_NEVER_SLASHED,
    winner.id
  );
  let hasOngoingStreak = badgeStreak.streakStartBlock.notEqual(negOneBI());
  if (
    hasOngoingStreak &&
    eventData.blockNumber.minus(badgeStreak.streakStartBlock).gt(minBlocks) &&
    winner.lastSyncBlockNumber.minus(badgeStreak.streakStartBlock).lt(minBlocks)
  ) {
    log.debug(
      "awarding NeverSlashed badge\nstreak start block: {}\ncurrent block: {}\nwinner: {}",
      [
        badgeStreak.streakStartBlock.toString(),
        eventData.blockNumber.toString(),
        winner.id,
      ]
    );
    createBadgeAward(_badgeDefinition(), winner.id, eventData);
    setBadgeStreakStart(
      BADGE_NAME_NEVER_SLASHED,
      winner.id,
      eventData.blockNumber
    );
  }
}

export function processStakeSlashedForNeverSlashedBadge(
  indexer: string,
  eventData: EventDataForBadgeAward
): void {
  setBadgeStreakStart(BADGE_NAME_NEVER_SLASHED, indexer, eventData.blockNumber);
}

function _badgeDefinition(): BadgeDefinition {
  return createOrLoadBadgeDefinitionWithStreak(
    BADGE_NAME_NEVER_SLASHED,
    BADGE_DESCRIPTION_NEVER_SLASHED,
    BigInt.fromI32(BADGE_VOTE_POWER_NEVER_SLASHED),
    "TBD",
    "TBD",
    daysToBlocks(BigInt.fromI32(BADGE_STREAK_MIN_DAYS_NEVER_SLASHED)),
    PROTOCOL_ROLE_INDEXER
  );
}
