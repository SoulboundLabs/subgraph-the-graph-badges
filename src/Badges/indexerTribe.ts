import { BigInt } from "@graphprotocol/graph-ts/index";
import { BadgeDefinition } from "../../generated/schema";
import {
  BADGE_DESCRIPTION_INDEXER_TRIBE,
  BADGE_NAME_INDEXER_TRIBE,
  BADGE_VOTE_POWER_INDEXER_TRIBE,
  PROTOCOL_ROLE_INDEXER,
} from "../helpers/constants";
import {
  createBadgeAward,
  createOrLoadBadgeDefinition,
  EventDataForBadgeAward,
} from "../helpers/models";

export function processNewIndexerForIndexerTribeBadge(
  indexerId: string,
  eventData: EventDataForBadgeAward
): void {
  createBadgeAward(_badgeDefinition(), indexerId, eventData);
}

function _badgeDefinition(): BadgeDefinition {
  return createOrLoadBadgeDefinition(
    BADGE_NAME_INDEXER_TRIBE,
    BADGE_DESCRIPTION_INDEXER_TRIBE,
    BigInt.fromI32(BADGE_VOTE_POWER_INDEXER_TRIBE),
    "TBD",
    "TBD",
    PROTOCOL_ROLE_INDEXER
  );
}
