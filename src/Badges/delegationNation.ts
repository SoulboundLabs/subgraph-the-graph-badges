import { BigInt } from "@graphprotocol/graph-ts/index";
import { BadgeDefinition, Delegator } from "../../generated/schema";
import {
  BADGE_DESCRIPTION_DELEGATION_NATION,
  BADGE_NAME_DELEGATION_NATION,
  BADGE_VOTE_POWER_DELEGATION_NATION,
} from "../helpers/constants";
import {
  createBadgeAward,
  createOrLoadBadgeDefinition,
  EventDataForBadgeAward,
} from "../helpers/models";

export function processUniqueDelegationForDelegationNationBadge(
  delegator: Delegator,
  eventData: EventDataForBadgeAward
): void {
  let minUniqueDelegations = delegator.uniqueActiveDelegationCount >= 5;
  let matchesBadgeLevel = delegator.uniqueActiveDelegationCount % 5 == 0;
  if (minUniqueDelegations && matchesBadgeLevel) {
    createBadgeAward(_badgeDefinition(), delegator.id, eventData);
  }
}

function _badgeDefinition(): BadgeDefinition {
  return createOrLoadBadgeDefinition(
    BADGE_NAME_DELEGATION_NATION,
    BADGE_DESCRIPTION_DELEGATION_NATION,
    BigInt.fromI32(BADGE_VOTE_POWER_DELEGATION_NATION),
    "TBD",
    "TBD"
  );
}
