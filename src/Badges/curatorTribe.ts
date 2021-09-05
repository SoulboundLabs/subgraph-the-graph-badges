import { BadgeDefinition } from "../../generated/schema";
import {
  createBadgeAward,
  createOrLoadBadgeDefinition,
  EventDataForBadgeAward,
} from "../helpers/models";
import {
  BADGE_NAME_CURATOR_TRIBE,
  BADGE_DESCRIPTION_CURATOR_TRIBE,
  BADGE_VOTE_POWER_CURATOR_TRIBE,
} from "../helpers/constants";
import { BigInt } from "@graphprotocol/graph-ts/index";

export function processNewCuratorForCuratorTribeBadge(
  curatorId: string,
  eventData: EventDataForBadgeAward
): void {
  createBadgeAward(_badgeDefinition(), curatorId, eventData);
}

function _badgeDefinition(): BadgeDefinition {
  return createOrLoadBadgeDefinition(
    BADGE_NAME_CURATOR_TRIBE,
    BADGE_DESCRIPTION_CURATOR_TRIBE,
    BigInt.fromI32(BADGE_VOTE_POWER_CURATOR_TRIBE),
    "TBD",
    "TBD"
  );
}
