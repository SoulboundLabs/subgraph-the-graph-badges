/**
 * This mapping handles the events from the Staking contract
 * https://github.com/graphprotocol/contracts/blob/master/contracts/staking/Staking.sol
 */

import {
  DelegatedStake,
  DelegationNationBadge,
  Delegator
} from "../../generated/schema";
import {
  AllocationClosed,
  AllocationCreated,
  StakeDelegated,
  StakeSlashed
} from "../../generated/Staking/Staking";
import {
  processAllocationClosedFor28DaysLaterBadge,
  processAllocationCreatedFor28DaysLaterBadge
} from "../Badges/28DaysLater";
import {
  processAllocationClosedForNeverSlashedBadge,
  processAllocationCreatedForNeverSlashedBadge
} from "../Badges/neverSlashed";
import { createOrLoadDelegator } from "../helpers/models";

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
  processAllocationCreatedFor28DaysLaterBadge(event);
  processAllocationCreatedForNeverSlashedBadge(event);
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
  processAllocationClosedForFirstToCloseBadge(event);
  processAllocationClosedFor28DaysLaterBadge(event);
  processAllocationClosedForNeverSlashedBadge(event);
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
  processStakeDelegatedForDelegationNationBadge(event);
}

export function processStakeDelegatedForDelegationNationBadge(
  event: StakeDelegated
): void {
  let indexerID = event.params.indexer.toHexString();
  let delegatorID = event.params.delegator.toHexString();
  let id = delegatorID.concat("-").concat(indexerID);
  let delegatedStake = DelegatedStake.load(id);

  if (delegatedStake == null) {
    delegatedStake = new DelegatedStake(id);
    delegatedStake.save();

    let delegator = createOrLoadDelegator(delegatorID);
    let uniqueDelegationCount = delegator.uniqueDelegationCount + 1;

    delegator.uniqueDelegationCount = uniqueDelegationCount;
    delegator.save();

    awardDelegationNationBadge(delegator);
  }
}

export function awardDelegationNationBadge(delegator: Delegator) {
  let minUniqueDelegations = delegator.uniqueDelegationCount >= 3;
  let matchesBadgeLevel = delegator.uniqueDelegationCount % 3 == 0;
  if (minUniqueDelegations && matchesBadgeLevel) {
    let delegationNationBadge = new DelegationNationBadge(delegator.id);
    delegationNationBadge.uniqueDelegationCount =
      delegator.uniqueDelegationCount;
  }
}
