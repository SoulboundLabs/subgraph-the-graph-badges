/**
 * This mapping handles the events from the Staking contract
 * https://github.com/graphprotocol/contracts/blob/master/contracts/staking/Staking.sol
 */

import {
  Allocation,
  FirstToCloseBadge,
  TwentyEightEpochsLaterBadge,
} from "../../generated/schema";
import {
  AllocationClosed,
  AllocationCreated,
  StakeSlashed,
} from "../../generated/Staking/Staking";
import { createOrLoadIndexer } from "../helpers/models";
import { toBigInt } from "../helpers/typeConverter";

export function handleStakeSlashed(event: StakeSlashed): void {}

/**
 * @dev Emitted when `indexer` allocated `tokens` amount to `subgraphDeploymentID`
 * during `epoch`.
 * `allocationID` indexer derived address used to identify the allocation.
 * `metadata` additional information related to the allocation.
 * Parameters:
 *   address indexed indexer,
 *   bytes32 indexed subgraphDeploymentID,
 *   uint256 epoch,
 *   uint256 tokens,
 *   address indexed allocationID,
 *   bytes32 metadata
 */
export function handleAllocationCreated(event: AllocationCreated): void {
  let allocationID = event.params.allocationID.toHexString();

  let allocation = new Allocation(allocationID);
  allocation.createdAtEpoch = event.params.epoch;
  allocation.save();
}

/**
 * @dev Emitted when `indexer` close an allocation in `epoch` for `allocationID`.
 * An amount of `tokens` get unallocated from `subgraphDeploymentID`.
 * The `effectiveAllocation` are the tokens allocated from creation to closing.
 * This event also emits the POI (proof of indexing) submitted by the indexer.
 * `isDelegator` is true if the sender was one of the indexer's delegators.
 * Parameters:
 *   address indexed indexer,
 *   bytes32 indexed subgraphDeploymentID,
 *   uint256 epoch,
 *   uint256 tokens,
 *   address indexed allocationID,
 *   uint256 effectiveAllocation,
 *   address sender,
 *   bytes32 poi,
 *   bool isDelegator
 */
export function handleAllocationClosed(event: AllocationClosed): void {
  // FirstToCloseBadge - awarded to indexers who are first to close an allocation for a subgraph
  let firstToClose = FirstToCloseBadge.load(
    event.params.subgraphDeploymentID.toHexString()
  );
  if (firstToClose == null) {
    // FirstToCloseBadge hasn't been awarded for this subgraphDeploymentId yet
    // Award to this indexer
    firstToClose = new FirstToCloseBadge(
      event.params.subgraphDeploymentID.toHexString()
    );
    firstToClose.indexer = event.params.indexer;
    firstToClose.awardedAtBlock = event.block.number;
    firstToClose.save();
  }

  // TwentyEightEpochsLaterBadge - awarded to indexers who close their allocation every 28 epochs or fewer
  let indexerID = event.params.indexer.toHexString();
  let allocationID = event.params.allocationID.toHexString();
  let currentEpoch = event.params.epoch;

  let indexer = createOrLoadIndexer(indexerID);
  let allocation = Allocation.load(allocationID);

  let epochsToClose = currentEpoch.minus(allocation.createdAtEpoch);
  let epochStartStreak =
    indexer.twentyEightEpochsLaterStartStreak || currentEpoch;
  let epochStreakLength = currentEpoch.minus(epochStartStreak);

  let badgeID = indexerID.concat("-").concat(epochStartStreak.toString());
  let twentyEightEpochsLater = TwentyEightEpochsLaterBadge.load(badgeID);

  let badgeIsActive = epochsToClose.lt(toBigInt(28));
  let noBadgeAwarded = twentyEightEpochsLater == null;

  let startBadgeStreak = badgeIsActive && noBadgeAwarded;
  let addBadgeStreak = badgeIsActive && !noBadgeAwarded;
  let endBadgeStreak = !badgeIsActive && !noBadgeAwarded;

  if (startBadgeStreak) {
    indexer.twentyEightEpochsLaterStartStreak = epochStartStreak;
    indexer.save();

    twentyEightEpochsLater = new TwentyEightEpochsLaterBadge(badgeID);
    twentyEightEpochsLater.indexer = indexer.id;
    twentyEightEpochsLater.epochStartStreak = epochStartStreak;
    twentyEightEpochsLater.epochStreakLength = epochStreakLength;
    twentyEightEpochsLater.save();
  } else if (addBadgeStreak) {
    twentyEightEpochsLater.epochStreakLength = epochStreakLength;
    twentyEightEpochsLater.save();
  } else if (endBadgeStreak) {
    indexer.twentyEightEpochsLaterStartStreak = null;
    indexer.save();

    twentyEightEpochsLater.epochEndStreak = currentEpoch;
    twentyEightEpochsLater.epochStreakLength = epochStreakLength;
    twentyEightEpochsLater.save();
  }
}

// let maxEpochsToCloseAllocation =
//   epochsToClose > twentyEightEpochsLater.maxEpochsToCloseAllocation
//     ? epochsToClose
//     : twentyEightEpochsLater.maxEpochsToCloseAllocation;
// indexer.maxEpochsToCloseAllocation = maxEpochsToCloseAllocation;
