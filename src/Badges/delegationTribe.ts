import { BadgeDefinition } from "../../generated/schema";
import {
  createBadgeAward,
  createOrLoadBadgeDefinition,
  EventDataForBadgeAward,
} from "../helpers/models";
import {
  BADGE_NAME_DELEGATION_TRIBE,
  BADGE_DESCRIPTION_DELEGATION_TRIBE,
  BADGE_VOTE_POWER_DELEGATION_TRIBE,
} from "../helpers/constants";
import { BigInt } from "@graphprotocol/graph-ts/index";

export function processNewDelegatorForDelegatorTribeBadge(
  delegatorId: string,
  eventData: EventDataForBadgeAward
): void {
  createBadgeAward(_badgeDefinition(), delegatorId, eventData);
}

function _badgeDefinition(): BadgeDefinition {
  return createOrLoadBadgeDefinition(
    BADGE_NAME_DELEGATION_TRIBE,
    BADGE_DESCRIPTION_DELEGATION_TRIBE,
    BigInt.fromI32(BADGE_VOTE_POWER_DELEGATION_TRIBE),
    "TBD",
    "TBD"
  );
}
