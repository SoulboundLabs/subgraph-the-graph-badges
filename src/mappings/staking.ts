/**
 * This mapping handles the events from the Staking contract
 * https://github.com/graphprotocol/contracts/blob/master/contracts/staking/Staking.sol
 */

import { FirstToCloseBadge } from "../../generated/schema";
import {
  AllocationClosed,
  StakeSlashed,
} from "../../generated/Staking/Staking";
import { createOrLoadIndexer } from "../helpers/models";

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
  allocation.createdAtEpoch = event.params.epoch.toI32();
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
  let indexerId = event.params.indexer.toHexString();
  let allocationID = event.params.allocationID.toHexString();
  let closedAtEpoch = event.params.epoch.toI32();

  let allocation = Allocation.load(allocationID);

  let epochsToClose = closedAtEpoch - allocation.createdAtEpoch;

  let maxEpochsToCloseAllocation =
    epochsToClose > twentyEightEpochsLater.maxEpochsToCloseAllocation
      ? epochsToClose
      : twentyEightEpochsLater.maxEpochsToCloseAllocation;

  let indexer = createOrLoadIndexer(indexerId);
  indexer.maxEpochsToCloseAllocation = maxEpochsToCloseAllocation;

  if (epochsToClose < 28) {
  }
  let twentyEightEpochsLater = TwentyEightEpochsLaterBadge.load(indexerId);

  if (twentyEightEpochsLater == null) {
    // TwentyEightEpochsLater hasn't been awarded for this subgraphDeploymentId yet
    // Conditionally award to this indexer
    twentyEightEpochsLater = new TwentyEightEpochsLaterBadge(indexerId);
    twentyEightEpochsLater.indexer = event.params.indexer;
    twentyEightEpochsLater.awardedAtBlock = event.block.number;
    twentyEightEpochsLater.maxEpochsToCloseAllocation = maxEpochsToCloseAllocation;
    twentyEightEpochsLater.save();
  }
}
