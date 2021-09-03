import { BadgeDefinition } from "../../generated/schema";
import {
  createBadgeAward,
  createOrLoadBadgeDefinition,
} from "../helpers/models";
import {
  BADGE_NAME_CURATOR_TRIBE,
  BADGE_DESCRIPTION_CURATOR_TRIBE,
  BADGE_URL_HANDLE_CURATOR_TRIBE,
  BADGE_VOTE_POWER_CURATOR_TRIBE,
} from "../helpers/constants";
import { BigInt } from "@graphprotocol/graph-ts/index";

export function processNewCuratorForCuratorTribeBadge(
  curatorId: string,
  blockNumber: BigInt
): void {
  createBadgeAward(_badgeDefinition(), curatorId, blockNumber);
}

function _badgeDefinition(): BadgeDefinition {
  return createOrLoadBadgeDefinition(
    BADGE_NAME_CURATOR_TRIBE,
    BADGE_URL_HANDLE_CURATOR_TRIBE,
    BADGE_DESCRIPTION_CURATOR_TRIBE,
    BigInt.fromI32(BADGE_VOTE_POWER_CURATOR_TRIBE),
    "TBD",
    "TBD"
  );
}
