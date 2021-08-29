import { BigInt } from "@graphprotocol/graph-ts/index";
import { BadgeDefinition, Curator, Subgraph } from "../../generated/schema";
import {
  BADGE_DESCRIPTION_PLANET_OF_THE_APED,
  BADGE_NAME_PLANET_OF_THE_APED,
  BADGE_VOTE_POWER_PLANET_OF_THE_APED,
} from "../helpers/constants";
import {
  createBadgeAward,
  createOrLoadBadgeDefinition,
} from "../helpers/models";
import { daysToBlocks } from "../helpers/typeConverter";

// Called every time a curator signals on a subgraph they haven't signalled on before.
export function processUniqueSignalForPlanetOfTheAped(
  curator: Curator,
  subgraphId: string,
  blockNumber: BigInt
): void {
  let subgraph = Subgraph.load(subgraphId);
  if (subgraph != null) {
    if (
      blockNumber
        .minus(subgraph.blockPublished)
        .lt(daysToBlocks(BigInt.fromI32(1)))
    ) {
      createBadgeAward(_badgeDefinition(), curator.id, blockNumber);
    }
  }
}

function _badgeDefinition(): BadgeDefinition {
  return createOrLoadBadgeDefinition(
    BADGE_NAME_PLANET_OF_THE_APED,
    BADGE_DESCRIPTION_PLANET_OF_THE_APED,
    BigInt.fromI32(BADGE_VOTE_POWER_PLANET_OF_THE_APED),
    "TBD",
    "TBD"
  );
}
