// FirstToCloseBadge - awarded to indexers who are first to close an allocation for a subgraph

import { BigInt } from "@graphprotocol/graph-ts/index";
import {
  Subgraph,
  BadgeDefinition,
  Allocation,
  SubgraphDeployment,
} from "../../generated/schema";
import {
  createOrLoadBadgeDefinition,
  createBadgeAward,
} from "../helpers/models";
import {
  BADGE_NAME_FIRST_TO_CLOSE,
  BADGE_DESCRIPTION_FIRST_TO_CLOSE,
  BADGE_URL_HANDLE_FIRST_TO_CLOSE,
  BADGE_VOTE_POWER_FIRST_TO_CLOSE,
} from "../helpers/constants";

export function processAllocationClosedForFirstToCloseBadge(
  allocation: Allocation,
  subgraphDeploymentId: string,
  blockNumber: BigInt
): void {
  let subgraphDeployment = SubgraphDeployment.load(subgraphDeploymentId);
  if (subgraphDeployment == null) {
    subgraphDeployment.firstToClose = allocation.indexer;
    subgraphDeployment.save();

    createBadgeAward(_badgeDefinition(), allocation.indexer, blockNumber);
  }
}

function _badgeDefinition(): BadgeDefinition {
  return createOrLoadBadgeDefinition(
    BADGE_NAME_FIRST_TO_CLOSE,
    BADGE_URL_HANDLE_FIRST_TO_CLOSE,
    BADGE_DESCRIPTION_FIRST_TO_CLOSE,
    BigInt.fromI32(BADGE_VOTE_POWER_FIRST_TO_CLOSE),
    "TBD",
    "TBD"
  );
}
