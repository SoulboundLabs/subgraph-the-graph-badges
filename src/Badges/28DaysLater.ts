import { BigInt } from "@graphprotocol/graph-ts/index";
import { Allocation, BadgeDefinition } from "../../generated/schema";
import {
  BADGE_DESCRIPTION_28_EPOCHS_LATER,
  BADGE_NAME_28_EPOCHS_LATER,
  BADGE_STREAK_MIN_CLOSES_28_EPOCHS_LATER,
  BADGE_VOTE_POWER_28_EPOCHS_LATER,
} from "../helpers/constants";
import { createOrLoadIndexer } from "../helpers/indexerManager";
import {
  createBadgeAward,
  createOrLoadBadgeDefinitionWithStreak,
} from "../helpers/models";

export function processAllocationClosedFor28DaysLaterBadge(
  allocation: Allocation,
  epoch: BigInt,
  blockNumber: BigInt
): void {
  if (epoch.minus(allocation.createdAtEpoch).lt(BigInt.fromI32(28))) {
    let indexer = createOrLoadIndexer(allocation.indexer);
    if (
      indexer.uniqueOpenAllocationCount %
        BADGE_STREAK_MIN_CLOSES_28_EPOCHS_LATER ==
      0
    ) {
      createBadgeAward(_badgeDefinition(), allocation.indexer, blockNumber);
    }
  }
}

function _badgeDefinition(): BadgeDefinition {
  return createOrLoadBadgeDefinitionWithStreak(
    BADGE_NAME_28_EPOCHS_LATER,
    BADGE_DESCRIPTION_28_EPOCHS_LATER,
    BigInt.fromI32(BADGE_VOTE_POWER_28_EPOCHS_LATER),
    "TBD",
    "TBD",
    BigInt.fromI32(BADGE_STREAK_MIN_CLOSES_28_EPOCHS_LATER)
  );
}
