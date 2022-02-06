import { BigInt, ethereum } from "@graphprotocol/graph-ts/index";
import {
  BadgeDefinition,
  BadgeUser,
  BadgeWinner,
  EarnedBadge,
  EarnedBadgeMetadata,
  MetricConsumer,
} from "../../generated/schema";
import { zeroBI } from "../helpers/constants";
import { createOrLoadEntityStats } from "../helpers/models";

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
  ipfsURI: string,
  level: i32
): BadgeDefinition {
  let badgeDefinition = BadgeDefinition.load(name);

  if (badgeDefinition == null) {
    badgeDefinition = new BadgeDefinition(name);
    badgeDefinition.description = description;
    badgeDefinition.metric = metric;
    badgeDefinition.threshold = threshold;
    badgeDefinition.votingPower = votingPower;
    badgeDefinition.ipfsURI = ipfsURI;
    badgeDefinition.earnedBadgeCount = 0;
    badgeDefinition.level = level;

    badgeDefinition.save();

    let metricConsumer = createOrLoadMetricConsumer(metric);
    let consumers = metricConsumer.badgeDefinitions;
    consumers.push(name);
    metricConsumer.badgeDefinitions = consumers;
    metricConsumer.save();
  }

  return badgeDefinition as BadgeDefinition;
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
    let entityStats = createOrLoadEntityStats();
    entityStats.earnedBadgeCount = entityStats.earnedBadgeCount + 1;
    entityStats.save();
    badgeDefinition.earnedBadgeCount = badgeDefinition.earnedBadgeCount + 1;
    badgeDefinition.save();

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
    earnedBadge.globalAwardNumber = entityStats.earnedBadgeCount;
    earnedBadge.awardNumber = badgeDefinition.earnedBadgeCount;
    earnedBadge.save();

    // create metadata entities
    for (let i = 0; i < eventData.metadata.length; i++) {
      let metadata = eventData.metadata[i] as EarnedBadgeEventMetadata;
      _createOrLoadEarnedBadgeMetaData(badgeId, metadata.name, metadata.value);
    }
  }
}

function _createOrLoadBadgeWinner(userId: string): BadgeWinner {
  let winner = BadgeWinner.load(userId);

  if (winner == null) {
    winner = new BadgeWinner(userId);
    winner.earnedBadgeCount = 0;
    winner.mintedAwardCount = 0;
    winner.votingPower = zeroBI();
    winner.save();

    let entityStats = createOrLoadEntityStats();
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
