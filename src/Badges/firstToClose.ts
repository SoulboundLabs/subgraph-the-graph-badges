// FirstToCloseBadge - awarded to indexers who are first to close an allocation for a subgraph

import { BigInt } from "@graphprotocol/graph-ts/index";
import {
  Allocation,
  BadgeDefinition,
  SubgraphDeployment,
} from "../../generated/schema";
import {
  BADGE_ARTIST_FIRST_TO_CLOSE,
  BADGE_DESCRIPTION_FIRST_TO_CLOSE,
  BADGE_NAME_FIRST_TO_CLOSE,
  BADGE_VOTE_POWER_FIRST_TO_CLOSE,
  PROTOCOL_ROLE_INDEXER,
} from "../helpers/constants";
import {
  createBadgeAward,
  createOrLoadBadgeDefinition,
  EventDataForBadgeAward,
} from "../helpers/models";

export function processAllocationClosedForFirstToCloseBadge(
  allocation: Allocation,
  subgraphDeploymentId: string,
  eventData: EventDataForBadgeAward
): void {
  let subgraphDeployment = SubgraphDeployment.load(subgraphDeploymentId);
  if (subgraphDeployment.firstToClose == null) {
    subgraphDeployment.firstToClose = allocation.indexer;
    subgraphDeployment.save();

    createBadgeAward(_badgeDefinition(), allocation.indexer, eventData);
  }
}

function _badgeDefinition(): BadgeDefinition {
  return createOrLoadBadgeDefinition(
    BADGE_NAME_FIRST_TO_CLOSE,
    BADGE_DESCRIPTION_FIRST_TO_CLOSE,
    BigInt.fromI32(BADGE_VOTE_POWER_FIRST_TO_CLOSE),
    BADGE_ARTIST_FIRST_TO_CLOSE,
    "TBD",
    PROTOCOL_ROLE_INDEXER
  );
}
