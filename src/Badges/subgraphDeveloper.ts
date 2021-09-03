import { BadgeDefinition, Publisher } from "../../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts/index";
import {
  createBadgeAward,
  createOrLoadBadgeDefinition,
} from "../helpers/models";
import {
  BADGE_NAME_SUBGRAPH_DEVELOPER,
  BADGE_DESCRIPTION_SUBGRAPH_DEVELOPER,
  BADGE_URL_HANDLE_SUBGRAPH_DEVELOPER,
  BADGE_VOTE_POWER_SUBGRAPH_DEVELOPER,
} from "../helpers/constants";

export function processSubgraphPublishedForSubgraphDeveloperBadge(
  publisher: Publisher,
  blockNumber: BigInt
): void {
  if (publisher.subgraphCount == 1) {
    createBadgeAward(_badgeDefinition(), publisher.id, blockNumber);
  }
}

function _badgeDefinition(): BadgeDefinition {
  return createOrLoadBadgeDefinition(
    BADGE_NAME_SUBGRAPH_DEVELOPER,
    BADGE_URL_HANDLE_SUBGRAPH_DEVELOPER,
    BADGE_DESCRIPTION_SUBGRAPH_DEVELOPER,
    BigInt.fromI32(BADGE_VOTE_POWER_SUBGRAPH_DEVELOPER),
    "TBD",
    "TBD"
  );
}
