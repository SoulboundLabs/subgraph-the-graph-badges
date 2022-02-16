import {
  BadgeDefinition,
  BadgeUser,
  BadgeWinner,
  EarnedBadge,
  EarnedBadgeMetadata,
  EarnedBadgeCount,
  MetricConsumer,
  BadgeMetric,
  EmblemEntityStats,
} from "../../generated/schema";
import { zeroBI } from "../helpers/constants";
import { BigInt, ethereum } from "@graphprotocol/graph-ts/index";
import { generateBadgeMetrics } from "./metrics";
import { generateGenesisBadgeDefinitions } from "./genesisBadges";

export function createOrLoadEmblemEntityStats(): EmblemEntityStats {
  let entityStats = EmblemEntityStats.load("1");

  if (entityStats == null) {
    entityStats = new EmblemEntityStats("1");
    entityStats.earnedBadgeCount = 0;
    entityStats.badgeWinnerCount = 0;
    entityStats.badgeDefinitionCount = 0;
    entityStats.badgeMetricCount = 0;

    entityStats.save();

    generateBadgeMetrics();
    generateGenesisBadgeDefinitions();
  }

  return entityStats as EmblemEntityStats;
}

export function createOrLoadBadgeUser(address: string): BadgeUser {
  let badgeUser = BadgeUser.load(address);

  if (badgeUser == null) {
    badgeUser = new BadgeUser(address);
    badgeUser.save();
  }

  return badgeUser as BadgeUser;
}

export function createOrLoadBadgeDefinition(
  name: string,
  description: string,
  metric: string,
  threshold: BigInt,
  votingPower: BigInt,
  ipfsURI: string
): BadgeDefinition {
  let badgeDefinition = BadgeDefinition.load(name);

  if (badgeDefinition == null) {
    _createOrLoadBadgeMetric(metric);

    badgeDefinition = new BadgeDefinition(name);
    badgeDefinition.description = description;
    badgeDefinition.metric = metric;
    badgeDefinition.threshold = threshold;
    badgeDefinition.votingPower = votingPower;
    badgeDefinition.ipfsURI = ipfsURI;
    badgeDefinition.earnedBadgeCount = 0;

    let entityStats = createOrLoadEmblemEntityStats();
    badgeDefinition.badgeDefinitionNumber = entityStats.badgeDefinitionCount;
    entityStats.badgeDefinitionCount = entityStats.badgeDefinitionCount + 1;
    entityStats.save();

    badgeDefinition.save();

    let metricConsumer = createOrLoadMetricConsumer(metric);
    let consumers = metricConsumer.badgeDefinitions;
    consumers.push(name);
    metricConsumer.badgeDefinitions = consumers;
    metricConsumer.save();
  }

  return badgeDefinition as BadgeDefinition;
}

function _createOrLoadBadgeMetric(metricName: string): BadgeMetric {
  let metric = BadgeMetric.load(metricName);
  if (metric == null) {
    metric = new BadgeMetric(metricName);
    const entityStats = createOrLoadEmblemEntityStats();
    metric.metricNumber = entityStats.badgeMetricCount;
    metric.save();
    entityStats.badgeMetricCount = entityStats.badgeMetricCount + 1;
    entityStats.save();
  }
  return metric as BadgeMetric;
}

function createOrLoadMetricConsumer(metric: string): MetricConsumer {
  let metricConsumer = MetricConsumer.load(metric);
  if (metricConsumer == null) {
    metricConsumer = new MetricConsumer(metric);
    metricConsumer.badgeDefinitions = new Array<string>();
    metricConsumer.save();
  }
  return metricConsumer as MetricConsumer;
}

export function createEarnedBadge(
  badgeDefinition: BadgeDefinition,
  badgeUserId: string,
  eventData: EarnedBadgeEventData
): void {
  let badgeId = badgeDefinition.id.concat("-").concat(badgeUserId);
  let earnedBadge = EarnedBadge.load(badgeId);

  if (earnedBadge == null) {
    // increment global, badgeDefinition, and badgeWinner earnedBadgeCounts
    let entityStats = createOrLoadEmblemEntityStats();
    let earnedBadgeCount = new EarnedBadgeCount(
      BigInt.fromI32(entityStats.earnedBadgeCount).toString()
    );
    earnedBadgeCount.globalBadgeNumber = entityStats.earnedBadgeCount;
    earnedBadgeCount.earnedBadge = badgeId;
    earnedBadgeCount.save();

    let badgeWinner = _createOrLoadBadgeWinner(badgeUserId);
    badgeWinner.earnedBadgeCount = badgeWinner.earnedBadgeCount + 1;
    badgeWinner.votingPower = badgeWinner.votingPower.plus(
      badgeDefinition.votingPower
    );
    badgeWinner.save();

    earnedBadge = new EarnedBadge(badgeId);
    earnedBadge.badgeWinner = badgeWinner.id;
    earnedBadge.definition = badgeDefinition.id;
    earnedBadge.blockAwarded = eventData.blockNumber;
    earnedBadge.transactionHash = eventData.transactionHash;
    earnedBadge.timestampAwarded = eventData.timestamp;
    earnedBadge.awardNumber = badgeDefinition.earnedBadgeCount + 1;
    earnedBadge.save();

    // create metadata entities
    for (let i = 0; i < eventData.metadata.length; i++) {
      let metadata = eventData.metadata[i] as EarnedBadgeEventMetadata;
      _createOrLoadEarnedBadgeMetaData(badgeId, metadata.name, metadata.value);
    }

    entityStats.earnedBadgeCount = entityStats.earnedBadgeCount + 1;
    entityStats.save();
    badgeDefinition.earnedBadgeCount = badgeDefinition.earnedBadgeCount + 1;
    badgeDefinition.save();
  }
}

function _createOrLoadBadgeWinner(userId: string): BadgeWinner {
  let winner = BadgeWinner.load(userId);

  if (winner == null) {
    winner = new BadgeWinner(userId);
    winner.badgeUser = userId;
    winner.earnedBadgeCount = 0;
    winner.mintedAwardCount = 0;
    winner.votingPower = zeroBI();
    winner.save();

    let entityStats = createOrLoadEmblemEntityStats();
    entityStats.badgeWinnerCount = entityStats.badgeWinnerCount + 1;
    entityStats.save();
  }

  return winner as BadgeWinner;
}

function _createOrLoadEarnedBadgeMetaData(
  earnedBadgeId: string,
  name: string,
  value: string
): void {
  let metadataId = earnedBadgeId.concat("-").concat(name);
  let metadata = EarnedBadgeMetadata.load(metadataId);
  if (metadata == null) {
    metadata = new EarnedBadgeMetadata(metadataId);
    metadata.earnedBadge = earnedBadgeId;
    metadata.name = name;
    metadata.value = value;
    metadata.save();
  }
}

// custom metadata from the event
export class EarnedBadgeEventMetadata {
  readonly name: string;
  readonly value: string;

  constructor(name: string, value: string) {
    this.name = name;
    this.value = value;
  }
}

// standard metadata from event/transaction
export class EarnedBadgeEventData {
  readonly blockNumber: BigInt;
  readonly transactionHash: string;
  readonly timestamp: BigInt;
  readonly metadata: Array<EarnedBadgeEventMetadata>;
  constructor(
    event: ethereum.Event,
    metadata: Array<EarnedBadgeEventMetadata>
  ) {
    this.blockNumber = event.block.number;
    this.transactionHash = event.transaction.hash.toHexString();
    this.timestamp = event.block.timestamp;
    this.metadata = metadata;
  }
}
