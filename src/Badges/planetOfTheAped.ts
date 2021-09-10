import { BigInt } from "@graphprotocol/graph-ts/index";
import { BadgeDefinition, Curator, Subgraph } from "../../generated/schema";
import {
  BADGE_DESCRIPTION_PLANET_OF_THE_APED,
  BADGE_NAME_PLANET_OF_THE_APED,
  BADGE_VOTE_POWER_PLANET_OF_THE_APED,
  PROTOCOL_ROLE_CURATOR,
} from "../helpers/constants";
import {
  createBadgeAward,
  createOrLoadBadgeDefinition,
  EventDataForBadgeAward,
} from "../helpers/models";

// Called every time a curator signals on a subgraph they haven't signalled on before.
export function processUniqueSignalForPlanetOfTheAped(
  curator: Curator,
  subgraphId: string,
  eventData: EventDataForBadgeAward
): void {
  let subgraph = Subgraph.load(subgraphId);
  let blocksSincePublish = eventData.blockNumber.minus(subgraph.blockPublished);
  let blockThreshold = BigInt.fromI32(420);
  if (subgraph != null) {
    if (blocksSincePublish.le(blockThreshold)) {
      createBadgeAward(_badgeDefinition(), curator.id, eventData);
    }
  }
}

function _badgeDefinition(): BadgeDefinition {
  return createOrLoadBadgeDefinition(
    BADGE_NAME_PLANET_OF_THE_APED,
    BADGE_DESCRIPTION_PLANET_OF_THE_APED,
    BigInt.fromI32(BADGE_VOTE_POWER_PLANET_OF_THE_APED),
    "TBD",
    "TBD",
    PROTOCOL_ROLE_CURATOR
  );
}
