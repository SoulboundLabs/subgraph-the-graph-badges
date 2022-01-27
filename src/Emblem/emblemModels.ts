import {
  BadgeDefinition,
  User,
  BadgeAward,
  BadgeAwardMetadata,
  MetricConsumer,
} from "../../generated/schema";
import { zeroBI } from "../helpers/constants";
import { createOrLoadEntityStats } from "../helpers/models";
import { BigInt, ethereum } from "@graphprotocol/graph-ts/index";

export function createOrLoadUser(address: string): User {
  let user = User.load(address);

  if (user == null) {
    user = new User(address);
    user.awardCount = 0;
    user.mintedAwardCount = 0;
    user.votingPower = zeroBI();

    user.save();
  }

  return user as User;
}

export function createOrLoadBadgeDefinition(
  name: string,
  description: string,
  metric: string,
  threshold: BigInt,
  votingPower: BigInt
): BadgeDefinition {
  let badgeDefinition = BadgeDefinition.load(name);

  if (badgeDefinition == null) {
    badgeDefinition = new BadgeDefinition(name);
    badgeDefinition.description = description;
    badgeDefinition.metric = metric;
    badgeDefinition.threshold = threshold;
    badgeDefinition.votingPower = votingPower;
    badgeDefinition.awardCount = 0;

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

export function createBadgeAward(
  badgeDefinition: BadgeDefinition,
  user: User,
  eventData: BadgeAwardEventData
): void {
  let badgeId = badgeDefinition.id.concat("-").concat(user.id);
  let badgeAward = BadgeAward.load(badgeId);

  if (badgeAward == null) {
    // increment global, badgeDefinition, and user awardCounts
    let entityStats = createOrLoadEntityStats();
    entityStats.awardCount = entityStats.awardCount + 1;
    entityStats.save();
    badgeDefinition.awardCount = badgeDefinition.awardCount + 1;
    badgeDefinition.save();
    user.awardCount = user.awardCount + 1;
    user.votingPower = user.votingPower.plus(badgeDefinition.votingPower);
    user.save();

    badgeAward = new BadgeAward(badgeId);
    badgeAward.user = user.id;
    badgeAward.definition = badgeDefinition.id;
    badgeAward.blockAwarded = eventData.blockNumber;
    badgeAward.transactionHash = eventData.transactionHash;
    badgeAward.timestampAwarded = eventData.timestamp;
    badgeAward.globalAwardNumber = entityStats.awardCount;
    badgeAward.awardNumber = badgeDefinition.awardCount;
    badgeAward.save();

    // create metadata entities
    for (let i = 0; i < eventData.metadata.length; i++) {
      let metadata = eventData.metadata[i] as BadgeAwardEventMetadata;
      _createOrLoadBadgeAwardMetaData(badgeId, metadata.name, metadata.value);
    }
  }
}

function _createOrLoadBadgeAwardMetaData(
  badgeAwardId: string,
  name: string,
  value: string
): void {
  let metadataId = badgeAwardId.concat("-").concat(name);
  let metadata = BadgeAwardMetadata.load(metadataId);
  if (metadata == null) {
    metadata = new BadgeAwardMetadata(metadataId);
    metadata.badgeAward = badgeAwardId;
    metadata.name = name;
    metadata.value = value;
    metadata.save();
  }
}

// custom metadata from the event
export class BadgeAwardEventMetadata {
  readonly name: string;
  readonly value: string;

  constructor(name: string, value: string) {
    this.name = name;
    this.value = value;
  }
}

// standard metadata from event/transaction
export class BadgeAwardEventData {
  readonly blockNumber: BigInt;
  readonly transactionHash: string;
  readonly timestamp: BigInt;
  readonly metadata: Array<BadgeAwardEventMetadata>;
  constructor(event: ethereum.Event, metadata: Array<BadgeAwardEventMetadata>) {
    this.blockNumber = event.block.number;
    this.transactionHash = event.transaction.hash.toHexString();
    this.timestamp = event.block.timestamp;
    this.metadata = metadata;
  }
}
