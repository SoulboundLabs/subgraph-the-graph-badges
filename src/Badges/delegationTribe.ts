import { BadgeDefinition } from "../../generated/schema";
import {
  createBadgeAward,
  createOrLoadBadgeDefinition,
} from "../helpers/models";
import {
  BADGE_NAME_DELEGATION_TRIBE,
  BADGE_DESCRIPTION_DELEGATION_TRIBE,
  BADGE_VOTE_POWER_DELEGATION_TRIBE,
} from "../helpers/constants";
import { BigInt } from "@graphprotocol/graph-ts/index";

export function processNewDelegatorForDelegatorTribeBadge(
  delegatorId: string,
  blockNumber: BigInt
): void {
  createBadgeAward(_badgeDefinition(), delegatorId, blockNumber);
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
