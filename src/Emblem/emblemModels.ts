import { BigInt, ethereum } from "@graphprotocol/graph-ts/index";
import {
  BadgeDefinition,
  BadgeMetric,
  EmblemUser,
  EarnedBadge,
  EarnedBadgeMetadata,
  EmblemEntityStats,
  MetricConsumer,
  EmblemUserRole,
  EmblemUserCount,
} from "../../generated/schema";
import { zeroBI } from "../helpers/constants";
import { generateGenesisBadgeDefinitions } from "./genesisBadges";
import { generateBadgeMetrics } from "./metrics";

export function createOrLoadEmblemEntityStats(): EmblemEntityStats {
  let entityStats = EmblemEntityStats.load("1");

  if (entityStats == null) {
    entityStats = new EmblemEntityStats("1");
    entityStats.earnedBadgeCount = 0;
    entityStats.badgeDefinitionCount = 0;
    entityStats.badgeMetricCount = 0;

    entityStats.save();

    generateBadgeMetrics();
    generateGenesisBadgeDefinitions();
  }

  return entityStats as EmblemEntityStats;
}

export function createOrLoadEmblemUser(address: string): EmblemUser {
  let emblemUser = EmblemUser.load(address);

  if (emblemUser == null) {
    emblemUser = new EmblemUser(address);
    emblemUser.communityScore = zeroBI();
    emblemUser.earnedBadgeCount = 0;
    emblemUser.lastSyncedBlockNumber = zeroBI();
    emblemUser.save();

    const entityStats = createOrLoadEmblemEntityStats();
    const emblemUserCount = new EmblemUserCount(
      BigInt.fromI32(entityStats.emblemUserCount).toString()
    );
    emblemUserCount.save();
    entityStats.emblemUserCount = entityStats.emblemUserCount + 1;
    entityStats.save();
  }

  return emblemUser as EmblemUser;
}

export function createOrLoadEmblemUserRole(
  address: string,
  protocolRole: string
): EmblemUserRole {
  const id = address.concat("-").concat(protocolRole);
  let emblemUserRole = EmblemUserRole.load(id);

  if (emblemUserRole == null) {
    emblemUserRole = new EmblemUserRole(id);
    emblemUserRole.emblemUser = address;
    emblemUserRole.communityScore = zeroBI();
    emblemUserRole.protocolRole = protocolRole;
    emblemUserRole.save();
  }

  return emblemUserRole as EmblemUserRole;
}

export function createBadgeDefinition(
  name: string,
  description: string,
  metricId: i32,
  threshold: BigInt,
  communityScore: BigInt,
  ipfsURI: string
): BadgeDefinition {
  let entityStats = createOrLoadEmblemEntityStats();
  const badgeDefinitionId = BigInt.fromI32(
    entityStats.badgeDefinitionCount
  ).toString();
  entityStats.badgeDefinitionCount = entityStats.badgeDefinitionCount + 1;
  entityStats.save();

  let badgeDefinition = BadgeDefinition.load(badgeDefinitionId);

  if (badgeDefinition == null) {
    badgeDefinition = new BadgeDefinition(badgeDefinitionId);
    badgeDefinition.name = name;
    badgeDefinition.description = description;
    badgeDefinition.metric = BigInt.fromI32(metricId).toString();
    badgeDefinition.threshold = threshold;
    badgeDefinition.communityScore = communityScore;
    badgeDefinition.ipfsURI = ipfsURI;
    badgeDefinition.earnedBadgeCount = 0;

    badgeDefinition.save();

    let metricConsumer = createOrLoadMetricConsumer(metricId);
    let consumers = metricConsumer.badgeDefinitions;
    consumers.push(badgeDefinitionId);
    metricConsumer.badgeDefinitions = consumers;
    metricConsumer.save();
  }

  return badgeDefinition as BadgeDefinition;
}

function createOrLoadMetricConsumer(metricId: i32): MetricConsumer {
  let metricConsumer = MetricConsumer.load(BigInt.fromI32(metricId).toString());
  if (metricConsumer == null) {
    metricConsumer = new MetricConsumer(BigInt.fromI32(metricId).toString());
    metricConsumer.badgeDefinitions = new Array<string>();
    metricConsumer.save();
  }
  return metricConsumer as MetricConsumer;
}

export function createEarnedBadge(
  badgeDefinition: BadgeDefinition,
  emblemUserId: string,
  eventData: EarnedBadgeEventData
): void {
  let entityStats = createOrLoadEmblemEntityStats();
  let badgeId = BigInt.fromI32(entityStats.earnedBadgeCount + 1).toString();
  entityStats.earnedBadgeCount = entityStats.earnedBadgeCount + 1;
  entityStats.save();

  let earnedBadge = EarnedBadge.load(badgeId);

  if (earnedBadge == null) {
    let badgeMetric = BadgeMetric.load(badgeDefinition.metric) as BadgeMetric;
    let emblemUserRole = createOrLoadEmblemUserRole(
      emblemUserId,
      badgeMetric.protocolRole
    );
    emblemUserRole.communityScore = emblemUserRole.communityScore.plus(
      badgeDefinition.communityScore
    );
    emblemUserRole.save();

    let emblemUser = createOrLoadEmblemUser(emblemUserId);
    emblemUser.earnedBadgeCount = emblemUser.earnedBadgeCount + 1;
    emblemUser.communityScore = emblemUser.communityScore.plus(
      badgeDefinition.communityScore
    );
    emblemUser.save();

    earnedBadge = new EarnedBadge(badgeId);
    earnedBadge.emblemUser = emblemUser.id;
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
