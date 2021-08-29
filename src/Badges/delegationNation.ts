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
} from "../helpers/models";

export function processUniqueDelegationForDelegationNationBadge(
  delegator: Delegator,
  blockNumber: BigInt
): void {
  let minUniqueDelegations = delegator.uniqueActiveDelegationCount >= 3;
  let matchesBadgeLevel = delegator.uniqueActiveDelegationCount % 3 == 0;
  if (minUniqueDelegations && matchesBadgeLevel) {
    createBadgeAward(_badgeDefinition(), delegator.id, blockNumber);
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
