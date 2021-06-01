import {
  DelegatedStake,
  DelegationNationBadge,
  Delegator
} from "../../generated/schema";
import { StakeDelegated } from "../../generated/Staking/Staking";
import {
  createOrLoadDelegator,
  createOrLoadEntityStats
} from "../helpers/models";

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

export function awardDelegationNationBadge(delegator: Delegator): void {
  let entityStats = createOrLoadEntityStats();
  let minUniqueDelegations = delegator.uniqueDelegationCount >= 3;
  let matchesBadgeLevel = delegator.uniqueDelegationCount % 3 == 0;
  if (minUniqueDelegations && matchesBadgeLevel) {
    let delegationNationBadge = new DelegationNationBadge(delegator.id);
    delegationNationBadge.delegator = delegator.id;
    delegationNationBadge.eraAwarded = entityStats.lastEraProcessed;
    delegationNationBadge.save();
  }
}
