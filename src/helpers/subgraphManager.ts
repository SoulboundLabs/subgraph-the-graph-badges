import {
  Subgraph,
  Publisher,
  SubgraphDeployment,
} from "../../generated/schema";
import { log, BigInt } from "@graphprotocol/graph-ts";
import { SubgraphPublished } from "../../generated/GNS/GNS";
import { createOrLoadGraphAccount } from "./models";
import { processSubgraphPublishedForSubgraphDeveloperBadge } from "../Badges/subgraphDeveloper";

////////////////      Public

export function processSubgraphPublished(event: SubgraphPublished): void {
  _processSubgraphPublished(
    event.params.graphAccount.toHexString(),
    event.params.subgraphNumber,
    event.params.subgraphDeploymentID.toHexString(),
    event.block.number
  );
}

////////////////      Event Processing

function _processSubgraphPublished(
  publisherId: string,
  subgraphNumber: BigInt,
  subgraphDeploymentId: string,
  blockPublished: BigInt
): void {
  let subgraphId = publisherId.concat("-").concat(subgraphNumber.toString());
  _createOrLoadSubgraph(subgraphId, publisherId, blockPublished);
  let publisher = _createOrLoadPublisher(publisherId);
  _createOrLoadSubgraphDeployment(subgraphDeploymentId, blockPublished);
  _broadcastSubgraphPublished(publisher, blockPublished);
}

////////////////      Broadcasting

function _broadcastSubgraphPublished(
  publisher: Publisher,
  blockNumber: BigInt
): void {
  log.debug("broadcasting SubgraphPublished", []);
  processSubgraphPublishedForSubgraphDeveloperBadge(publisher, blockNumber);
}

////////////////      Models

function _createOrLoadSubgraph(
  subgraphId: string,
  publisherId: string,
  blockPublished: BigInt
): Subgraph {
  let subgraph = Subgraph.load(subgraphId);
  if (subgraph == null) {
    let publisher = _createOrLoadPublisher(publisherId);
    publisher.subgraphCount = publisher.subgraphCount + 1;
    publisher.save();

    subgraph = new Subgraph(subgraphId);
    subgraph.owner = publisherId;
    subgraph.blockPublished = blockPublished;
    subgraph.save();
  }

  return subgraph as Subgraph;
}

function _createOrLoadSubgraphDeployment(
  subgraphDeploymentId: string,
  blockPublished: BigInt
): SubgraphDeployment {
  let sdi = SubgraphDeployment.load(subgraphDeploymentId);
  if (sdi == null) {
    sdi = new SubgraphDeployment(subgraphDeploymentId);
    sdi.blockPublished = blockPublished;
    sdi.save();
  }

  return sdi as SubgraphDeployment;
}

function _createOrLoadPublisher(publisherId: string): Publisher {
  let publisher = Publisher.load(publisherId);
  if (publisher == null) {
    log.debug("Creating new publisher {}", [publisherId]);
    createOrLoadGraphAccount(publisherId);
    publisher = new Publisher(publisherId);
    publisher.account = publisherId;
    publisher.subgraphCount = 0;
    publisher.save();
  }

  return publisher as Publisher;
}
