import { BadgeAward, Curator, BadgeDefinition, SignalledStake } from "../../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts/index";
import {
  createAwardedAtBlock,
  createOrLoadBadgeDefinition,
  addVotingPower
} from "../helpers/models";
import {
  BADGE_NAME_SUBGRAPH_SHARK,
  BADGE_DESCRIPTION_SUBGRAPH_SHARK,
  BADGE_URL_HANDLE_SUBGRAPH_SHARK,
  BADGE_VOTE_POWER_SUBGRAPH_SHARK
} from "../helpers/constants";

export function processCurationBurnForSubgraphShark(
  curator: Curator,
  costBasis: BigInt,
  burnPrice: BigInt,
  blockNumber: BigInt
): void {
  if (burnPrice.gt(costBasis)) {
    _awardSubgraphSharkBadge(curator, blockNumber);
  }
}

function _awardSubgraphSharkBadge(
  curator: Curator, 
  blockNumber: BigInt): void {

  let badgeDefinition = _badgeDefinition();
  badgeDefinition.badgeCount = badgeDefinition.badgeCount + 1;
  badgeDefinition.save();

  let badgeNumberString = BigInt.fromI32(badgeDefinition.badgeCount).toString();

  // award badge
  let badgeId = BADGE_NAME_SUBGRAPH_SHARK.concat("-")
    .concat(badgeNumberString);
  let badge = new BadgeAward(badgeId);
  badge.winner = curator.id;
  badge.definition = badgeDefinition.id;
  badge.awardedAt = createAwardedAtBlock(badge, blockNumber).id;
  badge.badgeNumber = badgeDefinition.badgeCount;
  badge.save();

  addVotingPower(curator.id, badgeDefinition.votingPower);
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