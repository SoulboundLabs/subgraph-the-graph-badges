import { Winner, TokenLockWallet, Indexer, BadgeTrackProgress, BadgeTrack, BadgeDefinition } from "../../generated/schema";
import { getBadgeTrackConfig, BADGE_TRACK_LEVEL_NAMES, zeroBI, oneBI, BadgeTrackConfig, PROTOCOL_NAME_THE_GRAPH } from "../helpers/constants";
import { log, BigInt } from "@graphprotocol/graph-ts";
import { createBadgeAward, createOrLoadBadgeDefinition, createOrLoadBadgeTrack, EventDataForBadgeAward } from "../helpers/models";
import { isTokenLockWallet } from "../mappings/graphTokenLockWallet";


export function updateProgressForTrack(
  track: string, 
  winner: string, 
  updatedProgress: BigInt,
  eventData: EventDataForBadgeAward
): void {
  let badgeTrackConst = getBadgeTrackConfig(track);

  let badgeTrackProgress = createOrLoadBadgeTrackProgress(badgeTrackConst, winner);
  updateProgress(badgeTrackProgress, badgeTrackConst.thresholds, updatedProgress, eventData);
}

export function incrementProgressForTrack(
  track: string, 
  winner: string,
  eventData: EventDataForBadgeAward
): void {
  let badgeTrackConst = getBadgeTrackConfig(track);
  let badgeTrackProgress = createOrLoadBadgeTrackProgress(badgeTrackConst, winner);
  let badgeTrack = getBadgeTrackConfig(track);
  updateProgress(badgeTrackProgress, badgeTrack.thresholds, badgeTrackProgress.progress.plus(oneBI()), eventData);
}

function updateProgress(
  badgeTrackProgress: BadgeTrackProgress, 
  thresholds: string[], 
  updatedProgress: BigInt,
  eventData: EventDataForBadgeAward
): void {
  let isLockWallet = isTokenLockWallet(badgeTrackProgress.winner);
  let i = badgeTrackProgress.level;
  for (i; i < thresholds.length; i++) {
    if (updatedProgress.lt(BigInt.fromString(thresholds[i]))) {
      break;
    }
    else {
      if (!isLockWallet) {
        _awardBadgeForTrackProgress(badgeTrackProgress, i, eventData);
      }
    }
  }
  if (i == thresholds.length) {
    i = thresholds.length - 1;
  }
  badgeTrackProgress.level = i;
  badgeTrackProgress.progress = updatedProgress;
  badgeTrackProgress.save();

  if (isLockWallet) {
    let beneficiary = (TokenLockWallet.load(badgeTrackProgress.winner) as TokenLockWallet).beneficiary;
    let badgeTrackConfig = getBadgeTrackConfig(badgeTrackProgress.badgeTrack);
    let beneficiaryTrackProgress = createOrLoadBadgeTrackProgress(badgeTrackConfig, beneficiary);
    
    if (beneficiaryTrackProgress.level < badgeTrackProgress.level) {
      beneficiaryTrackProgress.level = badgeTrackProgress.level;
      beneficiaryTrackProgress.save();
      _awardBadgeForTrackProgress(beneficiaryTrackProgress, beneficiaryTrackProgress.level, eventData);
    }
  }
}

function createOrLoadBadgeTrackProgress(
  track: BadgeTrackConfig, 
  winner: string
): BadgeTrackProgress {
  let id = track.name.concat("-").concat(winner);
  let badgeTrackProgress = BadgeTrackProgress.load(id);
  if (badgeTrackProgress == null) {
    createOrLoadBadgeTrack(track.name, track.role, PROTOCOL_NAME_THE_GRAPH);
    badgeTrackProgress = new BadgeTrackProgress(id);
    badgeTrackProgress.progress = zeroBI();
    badgeTrackProgress.winner = winner;
    badgeTrackProgress.badgeTrack = track.name;
    badgeTrackProgress.level = 0;
    badgeTrackProgress.save();

    if (isTokenLockWallet(winner)) {
      let lockWalletBeneficiary = (TokenLockWallet.load(winner) as TokenLockWallet).beneficiary;
      createOrLoadBadgeTrackProgress(track, lockWalletBeneficiary);
    }
  }
  return badgeTrackProgress as BadgeTrackProgress;
}

function _awardBadgeForTrackProgress(
  badgeTrackProgress: BadgeTrackProgress, 
  level: number,
  eventData: EventDataForBadgeAward,
): void {
  let badgeTrackConfig = getBadgeTrackConfig(badgeTrackProgress.badgeTrack);
  let badgeDefinition = _createOrLoadBadgeDefinitionFromTrackConst(badgeTrackConfig, level as i32);
  createBadgeAward(badgeDefinition, badgeTrackProgress.winner, eventData);
}

function _createOrLoadBadgeDefinitionFromTrackConst(
  badgeTrackConfig: BadgeTrackConfig,
  level: number
): BadgeDefinition {
  let badgeDefinitionName = badgeTrackConfig.name.concat(" ").concat(BADGE_TRACK_LEVEL_NAMES[level as i32]);
  let badgeDefinitionDescription = badgeTrackConfig.descriptions[level as i32];
  return createOrLoadBadgeDefinition(
    badgeDefinitionName,
    badgeDefinitionDescription,
    badgeTrackConfig.name,
    BigInt.fromI32(level as i32),
    ""
  );
}
