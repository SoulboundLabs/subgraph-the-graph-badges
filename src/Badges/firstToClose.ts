// FirstToCloseBadge - awarded to indexers who are first to close an allocation for a subgraph

import { AllocationClosed } from "../../generated/Staking/Staking";
import { createFirstToCloseBadge } from "../helpers/models";

export function processAllocationClosedForFirstToCloseBadge(
  event: AllocationClosed
): void {
  createFirstToCloseBadge(
    event.params.subgraphDeploymentID.toHexString(),
    event.params.indexer.toHexString()
  );
}
