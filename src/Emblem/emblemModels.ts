import { store } from "@graphprotocol/graph-ts";
import { BigInt, ethereum } from "@graphprotocol/graph-ts/index";
import {
  SoulboundBadge,
  SoulboundBadgeDefinition,
  SoulboundBadgeMetadata,
  SoulboundMetric,
  SoulboundMetricConsumer,
  SoulboundStats,
  SoulboundTier,
  SoulboundTierUser,
  SoulboundUser,
  SoulboundUserCount,
  SoulboundUserRole,
} from "../../generated/schema";
import { zeroBI } from "../helpers/constants";
import { generateGenesisSoulboundBadgeDefinitions } from "./genesisSoulboundBadges";
import { generateSoulboundMetrics } from "./metrics";

export function createOrLoadSoulboundStats(): SoulboundStats {
  let entityStats = SoulboundStats.load("1");

  if (entityStats == null) {
    entityStats = new SoulboundStats("1");
    entityStats.soulboundBadgeCount = 0;
    entityStats.soulboundBadgeDefinitionCount = 0;
    entityStats.soulboundMetricCount = 0;

    entityStats.save();

    generateSoulboundMetrics();
    generateGenesisSoulboundBadgeDefinitions();
  }

  return entityStats as SoulboundStats;
}

export function createOrLoadSoulboundUser(address: string): SoulboundUser {
  let soulboundUser = SoulboundUser.load(address);

  if (soulboundUser == null) {
    soulboundUser = new SoulboundUser(address);
    soulboundUser.communityScore = zeroBI();
    soulboundUser.soulboundBadgeCount = 0;
    soulboundUser.lastSyncedBlockNumber = zeroBI();
    soulboundUser.save();

    const entityStats = createOrLoadSoulboundStats();
    const soulboundUserCount = new SoulboundUserCount(
      BigInt.fromI32(entityStats.soulboundUserCount).toString()
    );
    soulboundUserCount.save();
    entityStats.soulboundUserCount = entityStats.soulboundUserCount + 1;
    entityStats.save();
  }

  return soulboundUser as SoulboundUser;
}

export function createOrLoadSoulboundUserRole(
  address: string,
  protocolRole: string
): SoulboundUserRole {
  const id = address.concat("-").concat(protocolRole);
  let soulboundUserRole = SoulboundUserRole.load(id);

  if (soulboundUserRole == null) {
    soulboundUserRole = new SoulboundUserRole(id);
    soulboundUserRole.soulboundUser = address;
    soulboundUserRole.communityScore = zeroBI();
    soulboundUserRole.protocolRole = protocolRole;
    soulboundUserRole.save();
  }

  return soulboundUserRole as SoulboundUserRole;
}

export function createSoulboundBadgeDefinition(
  name: string,
  description: string,
  metricId: i32,
  threshold: BigInt,
  communityScore: BigInt,
  ipfsURI: string
): SoulboundBadgeDefinition {
  let entityStats = createOrLoadSoulboundStats();
  const soulboundBadgeDefinitionId = BigInt.fromI32(
    entityStats.soulboundBadgeDefinitionCount
  ).toString();
  entityStats.soulboundBadgeDefinitionCount =
    entityStats.soulboundBadgeDefinitionCount + 1;
  entityStats.save();

  let soulboundBadgeDefinition = SoulboundBadgeDefinition.load(
    soulboundBadgeDefinitionId
  );

  if (soulboundBadgeDefinition == null) {
    soulboundBadgeDefinition = new SoulboundBadgeDefinition(
      soulboundBadgeDefinitionId
    );
    soulboundBadgeDefinition.name = name;
    soulboundBadgeDefinition.description = description;
    soulboundBadgeDefinition.metric = BigInt.fromI32(metricId).toString();
    soulboundBadgeDefinition.threshold = threshold;
    soulboundBadgeDefinition.communityScore = communityScore;
    soulboundBadgeDefinition.ipfsURI = ipfsURI;
    soulboundBadgeDefinition.soulboundBadgeCount = 0;

    soulboundBadgeDefinition.save();

    let soulboundMetricConsumer = createOrLoadSoulboundMetricConsumer(metricId);
    let consumers = soulboundMetricConsumer.soulboundBadgeDefinitions;
    consumers.push(soulboundBadgeDefinitionId);
    soulboundMetricConsumer.soulboundBadgeDefinitions = consumers;
    soulboundMetricConsumer.save();
  }

  return soulboundBadgeDefinition as SoulboundBadgeDefinition;
}

function createOrLoadSoulboundMetricConsumer(
  metricId: i32
): SoulboundMetricConsumer {
  let soulboundMetricConsumer = SoulboundMetricConsumer.load(
    BigInt.fromI32(metricId).toString()
  );
  if (soulboundMetricConsumer == null) {
    soulboundMetricConsumer = new SoulboundMetricConsumer(
      BigInt.fromI32(metricId).toString()
    );
    soulboundMetricConsumer.soulboundBadgeDefinitions = new Array<string>();
    soulboundMetricConsumer.save();
  }
  return soulboundMetricConsumer as SoulboundMetricConsumer;
}

function createOrLoadSoulboundTier(
  communityScore: BigInt,
  protocolRole: string
): SoulboundTier {
  let id = communityScore.toString().concat("-").concat(protocolRole);
  let soulboundTier = SoulboundTier.load(id);
  if (soulboundTier == null) {
    soulboundTier = new SoulboundTier(id);
    soulboundTier.communityScore = communityScore;
    soulboundTier.userCount = 0;
    soulboundTier.protocolRole = protocolRole;
    soulboundTier.save();
  }
  return soulboundTier as SoulboundTier;
}

function removeSoulboundTierUser(soulboundTierUserId: string): void {
  store.remove("SoulboundTierUser", soulboundTierUserId);
}

function createOrLoadSoulboundTierUser(
  soulboundTierId: string,
  soulboundUserId: string
): SoulboundTierUser {
  let id = soulboundTierId.concat("-").concat(soulboundUserId);
  let soulboundTierUser = SoulboundTierUser.load(soulboundTierId);
  if (soulboundTierUser == null) {
    soulboundTierUser = new SoulboundTierUser(id);
    soulboundTierUser.soulboundTier = soulboundTierId;
    soulboundTierUser.soulboundUser = soulboundUserId;
    soulboundTierUser.save();
  }
  return soulboundTierUser as SoulboundTierUser;
}

export function createSoulboundBadge(
  soulboundBadgeDefinition: SoulboundBadgeDefinition,
  soulboundUserId: string,
  eventData: SoulboundBadgeEventData
): void {
  let entityStats = createOrLoadSoulboundStats();
  let soulboundBadgeId = BigInt.fromI32(
    entityStats.soulboundBadgeCount + 1
  ).toString();
  entityStats.soulboundBadgeCount = entityStats.soulboundBadgeCount + 1;
  entityStats.save();

  let soulboundBadge = SoulboundBadge.load(soulboundBadgeId);

  if (soulboundBadge == null) {
    let soulboundMetric = SoulboundMetric.load(
      soulboundBadgeDefinition.metric
    ) as SoulboundMetric;
    let soulboundUserRole = createOrLoadSoulboundUserRole(
      soulboundUserId,
      soulboundMetric.protocolRole
    );
    soulboundUserRole.communityScore = soulboundUserRole.communityScore.plus(
      soulboundBadgeDefinition.communityScore
    );
    soulboundUserRole.save();

    let soulboundUser = createOrLoadSoulboundUser(soulboundUserId);

    let newCommunityScore = soulboundUser.communityScore.plus(
      soulboundBadgeDefinition.communityScore
    );
    soulboundUser.soulboundBadgeCount = soulboundUser.soulboundBadgeCount + 1;
    soulboundUser.communityScore = newCommunityScore;
    soulboundUser.save();

    soulboundBadge = new SoulboundBadge(soulboundBadgeId);
    soulboundBadge.soulboundUser = soulboundUser.id;
    soulboundBadge.definition = soulboundBadgeDefinition.id;
    soulboundBadge.blockAwarded = eventData.blockNumber;
    soulboundBadge.transactionHash = eventData.transactionHash;
    soulboundBadge.timestampAwarded = eventData.timestamp;
    soulboundBadge.awardNumber =
      soulboundBadgeDefinition.soulboundBadgeCount + 1;
    soulboundBadge.save();

    /* Update the count of users at the SoulboundTiers associated with both the awardee's old communityScore and new communityScore*/
    let formerSoulboundTier = createOrLoadSoulboundTier(
      soulboundUser.communityScore,
      soulboundMetric.protocolRole
    );

    let shouldDecrementUserCount = formerSoulboundTier.userCount > 0;

    if (shouldDecrementUserCount) {
      formerSoulboundTier.userCount = formerSoulboundTier.userCount - 1;
      formerSoulboundTier.save();
    }

    let newSoulboundTier = createOrLoadSoulboundTier(
      newCommunityScore,
      soulboundMetric.protocolRole
    );

    newSoulboundTier.userCount = newSoulboundTier.userCount + 1;
    newSoulboundTier.save();

    removeSoulboundTierUser(formerSoulboundTier.id);
    createOrLoadSoulboundTierUser(newSoulboundTier.id, soulboundUserId);
    /* End SoulboundTiers calculations */

    // create metadata entities
    for (let i = 0; i < eventData.metadata.length; i++) {
      let metadata = eventData.metadata[i] as SoulboundBadgeEventMetadata;
      _createOrLoadSoulboundBadgeMetaData(
        soulboundBadgeId,
        metadata.name,
        metadata.value
      );
    }

    entityStats.soulboundBadgeCount = entityStats.soulboundBadgeCount + 1;
    entityStats.save();
    soulboundBadgeDefinition.soulboundBadgeCount =
      soulboundBadgeDefinition.soulboundBadgeCount + 1;
    soulboundBadgeDefinition.save();
  }
}

function _createOrLoadSoulboundBadgeMetaData(
  soulboundBadgeId: string,
  name: string,
  value: string
): void {
  let metadataId = soulboundBadgeId.concat("-").concat(name);
  let metadata = SoulboundBadgeMetadata.load(metadataId);
  if (metadata == null) {
    metadata = new SoulboundBadgeMetadata(metadataId);
    metadata.soulboundBadge = soulboundBadgeId;
    metadata.name = name;
    metadata.value = value;
    metadata.save();
  }
}

// custom metadata from the event
export class SoulboundBadgeEventMetadata {
  readonly name: string;
  readonly value: string;

  constructor(name: string, value: string) {
    this.name = name;
    this.value = value;
  }
}

// standard metadata from event/transaction
export class SoulboundBadgeEventData {
  readonly blockNumber: BigInt;
  readonly transactionHash: string;
  readonly timestamp: BigInt;
  readonly metadata: Array<SoulboundBadgeEventMetadata>;
  constructor(
    event: ethereum.Event,
    metadata: Array<SoulboundBadgeEventMetadata>
  ) {
    this.blockNumber = event.block.number;
    this.transactionHash = event.transaction.hash.toHexString();
    this.timestamp = event.block.timestamp;
    this.metadata = metadata;
  }
}
