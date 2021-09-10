import { BigInt } from "@graphprotocol/graph-ts/index";
import { BadgeDefinition, Publisher } from "../../generated/schema";
import {
  BADGE_DESCRIPTION_SUBGRAPH_DEVELOPER,
  BADGE_NAME_SUBGRAPH_DEVELOPER,
  BADGE_VOTE_POWER_SUBGRAPH_DEVELOPER,
  PROTOCOL_ROLE_SUBGRAPH_DEVELOPER,
} from "../helpers/constants";
import {
  createBadgeAward,
  createOrLoadBadgeDefinition,
  EventDataForBadgeAward,
} from "../helpers/models";

export function processSubgraphPublishedForSubgraphDeveloperBadge(
  publisher: Publisher,
  eventData: EventDataForBadgeAward
): void {
  if (publisher.subgraphCount == 1) {
    createBadgeAward(_badgeDefinition(), publisher.id, eventData);
  }
}

function _badgeDefinition(): BadgeDefinition {
  return createOrLoadBadgeDefinition(
    BADGE_NAME_SUBGRAPH_DEVELOPER,
    BADGE_DESCRIPTION_SUBGRAPH_DEVELOPER,
    BigInt.fromI32(BADGE_VOTE_POWER_SUBGRAPH_DEVELOPER),
    "TBD",
    "TBD",
    PROTOCOL_ROLE_SUBGRAPH_DEVELOPER
  );
}
