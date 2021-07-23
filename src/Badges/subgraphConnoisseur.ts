import { BadgeAward, BadgeDefinition, Curator } from "../../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts/index";
import {
  addVotingPower,
  createAwardedAtBlock,
  createOrLoadBadgeDefinition,
  incrementWinner
} from "../helpers/models";
import {
  BADGE_NAME_SUBGRAPH_CONNOISSEUR,
  BADGE_DESCRIPTION_SUBGRAPH_CONNOISSEUR,
  BADGE_URL_HANDLE_SUBGRAPH_CONNOISSEUR,
  BADGE_VOTE_POWER_SUBGRAPH_CONNOISSEUR
} from "../helpers/constants";

// Called every time a curator signals on a subgraph they haven't signalled on before.
export function processUniqueSignalForSubgraphConnoisseur(
  curator: Curator, 
  blockNumber: BigInt
): void {
  if (curator.uniqueSignalCount == 3) {
    _awardSubgraphConnoisseurBadge(curator, blockNumber);
  }
}

function _awardSubgraphConnoisseurBadge(curator: Curator, blockNumber: BigInt): void {

  // update badge definition
  let badgeDefinition = _badgeDefinition();
  badgeDefinition.badgeCount = badgeDefinition.badgeCount + 1;
  badgeDefinition.save();

  let badgeNumberString = BigInt.fromI32(badgeDefinition.badgeCount).toString();

  // award badge
  let badgeId = BADGE_NAME_SUBGRAPH_CONNOISSEUR.concat("-")
    .concat(badgeNumberString);
  let badge = new BadgeAward(badgeId);
  let winner = incrementWinner(curator.id);
  badge.winner = winner.id;
  badge.winner = curator.id;
  badge.definition = badgeDefinition.id;
  badge.awardedAt = createAwardedAtBlock(badge, blockNumber).id;
  badge.badgeNumber = badgeDefinition.badgeCount;
  badge.save();

  addVotingPower(curator.id, badgeDefinition.votingPower);
}

function _badgeDefinition(): BadgeDefinition {
  return createOrLoadBadgeDefinition(
    BADGE_NAME_SUBGRAPH_CONNOISSEUR,
    BADGE_URL_HANDLE_SUBGRAPH_CONNOISSEUR,
    BADGE_DESCRIPTION_SUBGRAPH_CONNOISSEUR,
    BigInt.fromI32(BADGE_VOTE_POWER_SUBGRAPH_CONNOISSEUR),
    "TBD",
    "TBD"
  );
}