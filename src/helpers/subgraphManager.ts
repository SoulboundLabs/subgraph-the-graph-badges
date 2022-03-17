import { BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  SubgraphMetadataUpdated,
  SubgraphPublished,
} from "../../generated/GNS/GNS";
import {
  Publisher,
  Subgraph,
  SubgraphDeployment,
  SubgraphVersion,
} from "../../generated/schema";
import {
  EarnedBadgeEventData,
  EarnedBadgeEventMetadata,
} from "../Emblem/emblemModels";
import { incrementProgress } from "../Emblem/metricProgress";
import { beneficiaryIfLockWallet } from "../mappings/graphTokenLockWallet";
import {
  BADGE_AWARD_METADATA_NAME_SUBGRAPH,
  BADGE_METRIC_PUBLISHER_SUBGRAPHS_DEPLOYED_ID,
} from "../Emblem/metrics";
import {
  createOrLoadTheGraphEntityStats,
  createOrLoadGraphAccount,
} from "./models";
import { zeroBI } from "./constants";

////////////////      Public

export function processSubgraphPublished(event: SubgraphPublished): void {
  let publisherId = beneficiaryIfLockWallet(
    event.params.graphAccount.toHexString()
  );
  let subgraphId = publisherId
    .concat("-")
    .concat(event.params.subgraphNumber.toString());
  let metadata = new EarnedBadgeEventMetadata(
    BADGE_AWARD_METADATA_NAME_SUBGRAPH,
    subgraphId
  );
  let eventData = new EarnedBadgeEventData(event, [metadata]);

  let subgraph = _createOrLoadSubgraph(
    subgraphId,
    publisherId,
    eventData.blockNumber
  );
  let versionId = subgraphId
    .concat("-")
    .concat(subgraph.versionCount.toString());
  let versionNumber = subgraph.versionCount;
  subgraph.versionCount = subgraph.versionCount.plus(BigInt.fromI32(1));
  subgraph.currentVersion = versionId;
  subgraph.save();

  let deployment = _createOrLoadSubgraphDeployment(
    event.params.subgraphDeploymentID.toHexString(),
    eventData.blockNumber
  );

  // Create Subgraph Version
  let subgraphVersion = new SubgraphVersion(versionId);
  subgraphVersion.subgraph = subgraphId;
  subgraphVersion.subgraphDeployment = deployment.id;
  subgraphVersion.version = versionNumber;
  subgraphVersion.metadataHash = event.params.versionMetadata;
  subgraphVersion.save();

  incrementProgress(
    publisherId,
    BADGE_METRIC_PUBLISHER_SUBGRAPHS_DEPLOYED_ID,
    eventData
  );
}

export function processSubgraphMetadataUpdated(
  event: SubgraphMetadataUpdated
): void {
  let publisherId = event.params.graphAccount.toHexString();
  let subgraphNumber = event.params.subgraphNumber.toString();
  let subgraphId = publisherId.concat("-").concat(subgraphNumber.toString());
  let subgraph = _createOrLoadSubgraph(
    subgraphId,
    publisherId,
    event.block.timestamp
  );

  subgraph.metadataHash = event.params.subgraphMetadata;
  subgraph.save();
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
    subgraph.metadataHash = changetype<Bytes>(Bytes.fromI32(0));
    subgraph.versionCount = zeroBI();
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

    let entityStats = createOrLoadTheGraphEntityStats();
    entityStats.publisherCount = entityStats.publisherCount + 1;
    entityStats.save();
  }

  return publisher as Publisher;
}
