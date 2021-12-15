/**
 * This mapping handles the events from the Staking contract
 * https://github.com/graphprotocol/contracts/blob/master/contracts/staking/Staking.sol
 */

import {
  AllocationClosed,
  AllocationCreated,
  StakeDelegated,
  StakeDelegatedLocked,
  RebateClaimed,
  DelegationParametersUpdated
} from "../../generated/Staking/Staking";
import {
  processAllocationClosed,
  processAllocationCreated,
  processRebateClaimed,
  processDelegationParametersUpdated
} from "../helpers/indexerManager";
import {
  processStakeDelegated,
  processStakeDelegatedLocked,
} from "../helpers/delegationManager";
import { log } from "@graphprotocol/graph-ts";

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
  log.debug("AllocationCreated event found", []);
  processAllocationCreated(event);
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
  log.debug("AllocationClosed event found", []);
  processAllocationClosed(event);
}

/**
 * @dev Emitted when `delegator` delegated `tokens` to the `indexer`, the delegator
 * gets `shares` for the delegation pool proportionally to the tokens staked.
 * Parameters:
 *   address indexer
 *   address delegator
 *   uint256 tokens,
 *   uint256 shares
 */
export function handleStakeDelegated(event: StakeDelegated): void {
  log.debug("StakeDelegated event found", []);
  processStakeDelegated(event);
}

/**
 * @dev Emitted when `delegator` undelegated `tokens` to the `indexer`, tokens get
 * locked for withdrawal after a period of time.
 * Parameters:
 *   address indexer
 *   address delegator
 *   uint256 tokens,
 *   uint256 shares,
 *   uint256 until
 */
export function handleStakeDelegatedLocked(event: StakeDelegatedLocked): void {
  log.debug("StakeDelegatedLocked event found", []);
  processStakeDelegatedLocked(event);
}

/**
 * @dev Emitted when `indexer` claimed a rebate on `subgraphDeploymentID` during `epoch`
 * related to the `forEpoch` rebate pool.
 * The rebate is for `tokens` amount and `unclaimedAllocationsCount` are left for claim
 * in the rebate pool. `delegationFees` collected and sent to delegation pool.
 */
export function handleRebateClaimed(event: RebateClaimed): void {
  log.debug("RebateClaimed event found", []);
  processRebateClaimed(event);
}

/**
 * @dev Emitted when `indexer` update the delegation parameters for its delegation pool.
 */
export function handleDelegationParametersUpdated(event: DelegationParametersUpdated): void {
  log.debug("DelegationParametersUpdated event found", []);
  processDelegationParametersUpdated(event);
}