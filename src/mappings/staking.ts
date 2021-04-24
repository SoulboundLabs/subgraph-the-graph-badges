/**
 * This mapping handles the events from the Staking contract
 * https://github.com/graphprotocol/contracts/blob/master/contracts/staking/Staking.sol
 */

import { log } from "@graphprotocol/graph-ts";
import {
  FirstToCloseBadge,
} from "../../generated/schema";
import {
  AllocationClosed,
  StakeSlashed,
} from "../../generated/Staking/Staking";



export function handleStakeSlashed(event: StakeSlashed): void {

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
  let firstToClose = FirstToCloseBadge.load(event.params.subgraphDeploymentID.toHexString());
  if (firstToClose == null) {
    // FirstToCloseBadge hasn't been awarded for this subgraphDeploymentId yet
    // award to this indexer
    firstToClose = new FirstToCloseBadge(event.params.subgraphDeploymentID.toHexString());
    firstToClose.indexer = event.params.indexer;
    firstToClose.awardedAtBlock = event.block.number;
    firstToClose.save()
  }
}

