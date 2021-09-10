import { BigInt } from "@graphprotocol/graph-ts/index";
import { BadgeDefinition } from "../../generated/schema";
import {
  BADGE_DESCRIPTION_CURATOR_TRIBE,
  BADGE_NAME_CURATOR_TRIBE,
  BADGE_VOTE_POWER_CURATOR_TRIBE,
  PROTOCOL_ROLE_CURATOR,
} from "../helpers/constants";
import {
  createBadgeAward,
  createOrLoadBadgeDefinition,
  EventDataForBadgeAward,
} from "../helpers/models";

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
    "TBD",
    PROTOCOL_ROLE_CURATOR
  );
}
