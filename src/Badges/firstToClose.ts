// FirstToCloseBadge - awarded to indexers who are first to close an allocation for a subgraph

import { BigInt } from "@graphprotocol/graph-ts/index";
import { Allocation, BadgeDefinition, Subgraph } from "../../generated/schema";
import {
  BADGE_DESCRIPTION_FIRST_TO_CLOSE,
  BADGE_NAME_FIRST_TO_CLOSE,
  BADGE_VOTE_POWER_FIRST_TO_CLOSE,
} from "../helpers/constants";
import {
  createBadgeAward,
  createOrLoadBadgeDefinition,
} from "../helpers/models";

export function processAllocationClosedForFirstToCloseBadge(
  allocation: Allocation,
  blockNumber: BigInt
): void {
  let subgraph = Subgraph.load(allocation.subgraph);
  if (subgraph != null) {
    if (subgraph.firstToClose == null) {
      subgraph.firstToClose = allocation.indexer;
      subgraph.save();

      createBadgeAward(_badgeDefinition(), allocation.indexer, blockNumber);
    }
  }
}

function _badgeDefinition(): BadgeDefinition {
  return createOrLoadBadgeDefinition(
    BADGE_NAME_FIRST_TO_CLOSE,
    BADGE_DESCRIPTION_FIRST_TO_CLOSE,
    BigInt.fromI32(BADGE_VOTE_POWER_FIRST_TO_CLOSE),
    "TBD",
    "TBD"
  );
}
