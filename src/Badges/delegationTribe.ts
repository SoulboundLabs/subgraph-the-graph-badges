import { BigInt } from "@graphprotocol/graph-ts/index";
import { BadgeDefinition } from "../../generated/schema";
import {
  BADGE_ARTIST_DELEGATION_TRIBE,
  BADGE_DESCRIPTION_DELEGATION_TRIBE,
  BADGE_NAME_DELEGATION_TRIBE,
  BADGE_VOTE_POWER_DELEGATION_TRIBE,
  PROTOCOL_ROLE_DELEGATOR,
} from "../helpers/constants";
import {
  createBadgeAward,
  createOrLoadBadgeDefinition,
  EventDataForBadgeAward,
} from "../helpers/models";

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
    BADGE_ARTIST_DELEGATION_TRIBE,
    "TBD",
    PROTOCOL_ROLE_DELEGATOR
  );
}
