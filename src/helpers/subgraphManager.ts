import { Subgraph } from "../../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts/index";
import { SubgraphPublished } from "../../generated/GNS/GNS";
import { createOrLoadPublisher } from "./models";

export function processSubgraphPublished(event: SubgraphPublished): void {
  _processSubgraphPublished(
    event.params.subgraphDeploymentID.toHexString(),
    event.params.graphAccount.toHexString(),
    event.block.number
  );
}

function _processSubgraphPublished(
  subgraphId: string,
  publisherId: string,
  blockPublished: BigInt
): void {
  _createOrLoadSubgraph(subgraphId, publisherId, blockPublished);
}

function _createOrLoadSubgraph(
  subgraphId: string,
  publisherId: string,
  blockPublished: BigInt
): Subgraph {
  let subgraph = Subgraph.load(subgraphId);
  if (subgraph == null) {
    createOrLoadPublisher(publisherId);
    subgraph = new Subgraph(subgraphId);
    subgraph.owner = publisherId;
    subgraph.blockPublished = blockPublished;
    subgraph.save();
  }

  return subgraph as Subgraph;
}
