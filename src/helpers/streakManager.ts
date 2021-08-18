import { BigInt } from "@graphprotocol/graph-ts/index";
import {
  OngoingBadgeStreak,
  Winner,
  BadgeStreakDefinition,
} from "../../generated/schema";
import { negOneBI } from "./constants";
import { updateDelegationStreak } from "../Badges/delegationStreak";
import { updateNeverSlashedStreak } from "../Badges/neverSlashed";

export function syncAllStreaksForWinner(
  winner: Winner,
  blockNumber: BigInt
): void {
  updateDelegationStreak(winner, blockNumber);
  updateNeverSlashedStreak(winner, blockNumber);
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

export function restartBadgeStreak(
  badgeName: string,
  winner: string,
  blockNumber: BigInt
): void {
  let badgeStreak = createOrLoadOngoingBadgeStreak(badgeName, winner);
  badgeStreak.streakStartBlock = blockNumber;
  badgeStreak.save();
}

export function setBadgeStreak(
  badgeName: string,
  winner: string,
  streakStartBlock: BigInt
): void {
  let badgeStreak = createOrLoadOngoingBadgeStreak(badgeName, winner);
  badgeStreak.streakStartBlock = streakStartBlock;
  badgeStreak.save();
}
