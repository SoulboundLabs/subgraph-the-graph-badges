import { BadgeDefinition, Curator, Subgraph } from "../../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts/index";
import {
  createBadgeAward,
  createOrLoadBadgeDefinition,
} from "../helpers/models";
import {
  BADGE_NAME_PLANET_OF_THE_APED,
  BADGE_DESCRIPTION_PLANET_OF_THE_APED,
  BADGE_URL_HANDLE_PLANET_OF_THE_APED,
  BADGE_VOTE_POWER_PLANET_OF_THE_APED,
} from "../helpers/constants";
import { daysToBlocks } from "../helpers/typeConverter";

// Called every time a curator signals on a subgraph they haven't signalled on before.
export function processUniqueSignalForPlanetOfTheAped(
  curator: Curator,
  subgraphId: string,
  blockNumber: BigInt
): void {
  let subgraph = Subgraph.load(subgraphId);
  let blocksSincePublish = blockNumber.minus(subgraph.blockPublished);
  let blockThreshold = BigInt.fromI32(420);
  if (subgraph != null) {
    if (blocksSincePublish.le(blockThreshold)) {
      createBadgeAward(_badgeDefinition(), curator.id, blockNumber);
    }
  }
}

function _badgeDefinition(): BadgeDefinition {
  return createOrLoadBadgeDefinition(
    BADGE_NAME_PLANET_OF_THE_APED,
    BADGE_URL_HANDLE_PLANET_OF_THE_APED,
    BADGE_DESCRIPTION_PLANET_OF_THE_APED,
    BigInt.fromI32(BADGE_VOTE_POWER_PLANET_OF_THE_APED),
    "TBD",
    "TBD"
  );
}
