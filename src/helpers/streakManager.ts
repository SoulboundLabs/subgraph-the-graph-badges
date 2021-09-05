import { BigInt, log } from "@graphprotocol/graph-ts";
import {
  OngoingBadgeStreak,
  BadgeStreakDefinition,
} from "../../generated/schema";
import { negOneBI } from "./constants";
import { updateDelegationStreak } from "../Badges/delegationStreak";
import { updateNeverSlashedStreak } from "../Badges/neverSlashed";
import { createOrLoadWinner, EventDataForBadgeAward } from "./models";

export function syncAllStreaksForWinner(
  winnerId: string,
  eventData: EventDataForBadgeAward
): void {
  log.debug("Syncing streaks for winner {}", [winnerId]);
  let winner = createOrLoadWinner(winnerId);
  updateDelegationStreak(winner, eventData);
  updateNeverSlashedStreak(winner, eventData);
  winner.lastSyncBlockNumber = eventData.blockNumber;
  winner.save();
}

export function syncAllStreaksForWinners(
  winnerIds: string[],
  eventData: EventDataForBadgeAward
): void {
  for (let i = 0; i < winnerIds.length; i++) {
    syncAllStreaksForWinner(winnerIds[i], eventData);
  }
}

export function createOrLoadBadgeStreakDefinition(
  badgeName: string,
  minimumBlocks: BigInt
): BadgeStreakDefinition {
  let badgeStreakDefinition = BadgeStreakDefinition.load(badgeName);

  if (badgeStreakDefinition == null) {
    badgeStreakDefinition = new BadgeStreakDefinition(badgeName);
    badgeStreakDefinition.minimumBlocks = minimumBlocks;
    badgeStreakDefinition.badgeDefinition = badgeName;
    badgeStreakDefinition.save();
  }

  return badgeStreakDefinition as BadgeStreakDefinition;
}

export function createOrLoadOngoingBadgeStreak(
  badgeName: string,
  winner: string
): OngoingBadgeStreak {
  let streakId = badgeName.concat("-").concat(winner);
  let ongoingBadgeStreak = OngoingBadgeStreak.load(streakId);

  if (ongoingBadgeStreak == null) {
    ongoingBadgeStreak = new OngoingBadgeStreak(streakId);
    ongoingBadgeStreak.streakStartBlock = negOneBI();
    ongoingBadgeStreak.save();
  }

  return ongoingBadgeStreak as OngoingBadgeStreak;
}

export function endBadgeStreak(badgeName: string, winner: string): void {
  let badgeStreak = createOrLoadOngoingBadgeStreak(badgeName, winner);
  badgeStreak.streakStartBlock = negOneBI();
  badgeStreak.save();
}

export function setBadgeStreakStart(
  badgeName: string,
  winner: string,
  streakStartBlock: BigInt
): void {
  let badgeStreak = createOrLoadOngoingBadgeStreak(badgeName, winner);
  badgeStreak.streakStartBlock = streakStartBlock;
  badgeStreak.save();
}
