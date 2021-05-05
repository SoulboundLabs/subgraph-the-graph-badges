/**
 * This mapping handles the events from the Staking contract
 * https://github.com/graphprotocol/contracts/blob/master/contracts/staking/Staking.sol
 */

import { store } from "@graphprotocol/graph-ts";
import { BigInt } from "@graphprotocol/graph-ts/index";
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
import { oneBD } from "../helpers/constants";
import { epochToEra } from "../helpers/epoch";
import { createOrLoadIndexer, createOrLoadIndexerEra } from "../helpers/models";
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
  let indexerEra = createOrLoadIndexerEra(indexerID, currentEpoch);

  let allocation = Allocation.load(allocationID);

  let epochsToClose = currentEpoch.minus(allocation.createdAtEpoch);
  let isUnder28Epochs = epochsToClose.lt(toBigInt(28));

  // let epochStreakLength = currentEpoch.minus(
  //   indexer.twentyEightEpochsLaterStartStreak
  // );

  let currentEra = epochToEra(currentEpoch);

  let badgeID = indexerID.concat("-").concat(currentEra.toString());
  let twentyEightEpochsLater = TwentyEightEpochsLaterBadge.load(badgeID);

  let noBadgeAwarded = twentyEightEpochsLater == null;

  let isUnawarded = indexerEra.twentyEightEpochsLaterBadge == "Unawarded";
  let isAwarded = indexerEra.twentyEightEpochsLaterBadge == "Awarded";
  let isIneligible = indexerEra.twentyEightEpochsLaterBadge == "Ineligible";

  let awardBadge = isUnder28Epochs && noBadgeAwarded && isUnawarded;
  let addBadgeStreak = isUnder28Epochs && !noBadgeAwarded && isAwarded;
  let invalidateBadge = !isUnder28Epochs && !isIneligible;

  if (awardBadge) {
    twentyEightEpochsLater = new TwentyEightEpochsLaterBadge(badgeID);
    twentyEightEpochsLater.indexer = indexer.id;
    twentyEightEpochsLater.eraAwarded = currentEra;
    twentyEightEpochsLater.save();

    indexerEra.twentyEightEpochsLaterBadge = "Awarded";
    indexerEra.save();
  } else if (addBadgeStreak) {
    // twentyEightEpochsLater.epochStreakLength = epochStreakLength;
    // twentyEightEpochsLater.save();
  } else if (invalidateBadge) {
    store.remove("TwentyEightEpochsLaterBadge", badgeID);

    let ineligibleTwentyEightEpochsLaterBadgeCount =
      indexer.ineligibleTwentyEightEpochsLaterBadgeCount + 1;
    indexer.twentyEightEpochsLaterBadgePercentage =
      oneBD() -
      BigInt.fromI32(
        ineligibleTwentyEightEpochsLaterBadgeCount
      ).toBigDecimal() /
        currentEra.toBigDecimal();
    indexer.ineligibleTwentyEightEpochsLaterBadgeCount = ineligibleTwentyEightEpochsLaterBadgeCount;
    indexer.save();

    indexerEra.twentyEightEpochsLaterBadge = "Ineligible";
    indexerEra.save();
  }
}

// let maxEpochsToCloseAllocation =
//   epochsToClose > twentyEightEpochsLater.maxEpochsToCloseAllocation
//     ? epochsToClose
//     : twentyEightEpochsLater.maxEpochsToCloseAllocation;
// indexer.maxEpochsToCloseAllocation = maxEpochsToCloseAllocation;
