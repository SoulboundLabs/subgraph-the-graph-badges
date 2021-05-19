// FirstToCloseBadge - awarded to indexers who are first to close an allocation for a subgraph

import { FirstToCloseBadge } from "../../generated/schema";
import { AllocationClosed } from "../../generated/Staking/Staking";
import { BigInt } from "@graphprotocol/graph-ts/index";

export function processAllocationClosedForFirstToCloseBadge(
  event: AllocationClosed
): void {
  _processAllocationClosed(
    event.params.subgraphDeploymentID.toHexString(),
    event.params.indexer.toHexString(),
    event.block.number
  );
}

function _processAllocationClosed(
  subgraphDeploymentID: string,
  indexer: string,
  blockNumber: BigInt
): void {
  let firstToClose = FirstToCloseBadge.load(subgraphDeploymentID);
  if (firstToClose == null) {
    // FirstToCloseBadge hasn't been awarded for this subgraphDeploymentId yet
    // Award to this indexer
    firstToClose = new FirstToCloseBadge(subgraphDeploymentID);
    firstToClose.indexer = indexer;
    firstToClose.awardedAtBlock = blockNumber;
    firstToClose.save();
  }
}
