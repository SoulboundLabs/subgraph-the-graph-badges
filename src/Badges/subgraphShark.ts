import { Curator, BadgeDefinition } from "../../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts/index";
import {
  createBadgeAward,
  createOrLoadBadgeDefinition,
} from "../helpers/models";
import {
  BADGE_NAME_SUBGRAPH_SHARK,
  BADGE_DESCRIPTION_SUBGRAPH_SHARK,
  BADGE_URL_HANDLE_SUBGRAPH_SHARK,
  BADGE_VOTE_POWER_SUBGRAPH_SHARK,
} from "../helpers/constants";

export function processCurationBurnForSubgraphShark(
  curator: Curator,
  costBasis: BigInt,
  burnPrice: BigInt,
  blockNumber: BigInt
): void {
  if (burnPrice.gt(costBasis)) {
    createBadgeAward(_badgeDefinition(), curator.id, blockNumber);
  }
}

function _badgeDefinition(): BadgeDefinition {
  return createOrLoadBadgeDefinition(
    BADGE_NAME_SUBGRAPH_SHARK,
    BADGE_URL_HANDLE_SUBGRAPH_SHARK,
    BADGE_DESCRIPTION_SUBGRAPH_SHARK,
    BigInt.fromI32(BADGE_VOTE_POWER_SUBGRAPH_SHARK),
    "TBD",
    "TBD"
  );
}
