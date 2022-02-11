import {
  BadgeDefinition,
  BadgeUser,
  BadgeWinner,
  EarnedBadge,
  EarnedBadgeMetadata,
  EarnedBadgeCount,
  MetricConsumer,
  MerkleRoot,
  MerkleNode,
} from "../../generated/schema";
import { zeroBI } from "../helpers/constants";
import { createOrLoadEntityStats } from "../helpers/models";
import { BigInt, ethereum } from "@graphprotocol/graph-ts/index";
import { crypto, Bytes } from "@graphprotocol/graph-ts";

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
    badgeDefinition = new BadgeDefinition(name);
    badgeDefinition.description = description;
    badgeDefinition.metric = metric;
    badgeDefinition.threshold = threshold;
    badgeDefinition.votingPower = votingPower;
    badgeDefinition.ipfsURI = ipfsURI;
    badgeDefinition.earnedBadgeCount = 0;

    let entityStats = createOrLoadEntityStats();
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
    earnedBadge.encodedLeaf = _encodeLeaf(
      badgeWinner.id,
      badgeDefinition.badgeDefinitionNumber
    );
    earnedBadge.hash = _hashLeaf(
      badgeWinner.id,
      badgeDefinition.badgeDefinitionNumber
    );
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

    _generateMerkleRootIfNeeded();
  }
}

function _generateMerkleRootIfNeeded(): void {
  let entityStats = createOrLoadEntityStats();
  let merkleTreeSize = 256; // could add to schema and allow on-chain actions to change this value
  if (entityStats.earnedBadgeCount % merkleTreeSize == 0) {
    let r = _generateMerkleRoot(
      entityStats.lastMerkledBadgeIndex + 1,
      merkleTreeSize
    );
    let mRoot = new MerkleRoot(r.toHexString());
    mRoot.root = r;
    mRoot.earnedBadgeCountStart = entityStats.lastMerkledBadgeIndex + 1;
    mRoot.numberOfBadges = merkleTreeSize;
    mRoot.save();

    entityStats.lastMerkledBadgeIndex =
      entityStats.lastMerkledBadgeIndex + merkleTreeSize;
    entityStats.save();
  }
}

function _generateMerkleRoot(
  badgeNumberStart: i32,
  numberOfBadges: i32
): Bytes {
  let maxDepth = Math.log2(numberOfBadges) as i32;
  return _generateMerkleRootWithDepth(
    badgeNumberStart,
    numberOfBadges,
    0,
    maxDepth
  );
}

function _generateMerkleRootWithDepth(
  badgeNumberStart: i32,
  numberOfBadges: i32,
  depth: i32,
  maxDepth: i32
): Bytes {
  if (numberOfBadges > 2) {
    let leftBranch = _generateMerkleRootWithDepth(
      badgeNumberStart,
      numberOfBadges / 2,
      depth + 1,
      maxDepth
    );
    let rightBranch = _generateMerkleRootWithDepth(
      badgeNumberStart + numberOfBadges / 2,
      numberOfBadges / 2,
      depth + 1,
      maxDepth
    );
    let encoded = _concatBytes32(leftBranch, rightBranch);
    let hash = changetype<Bytes>(crypto.keccak256(encoded));

    let node = new MerkleNode(hash.toHex()) as MerkleNode;
    node.hash = hash;
    node.childEncoding = changetype<Bytes>(encoded);
    node.depth = depth;
    node.index = (badgeNumberStart / Math.pow(2, maxDepth - depth)) as i32;
    node.save();
    return hash;
  } else {
    let leftLeaf = _leafIdToHash(BigInt.fromI32(badgeNumberStart).toString());
    let rightLeaf = _leafIdToHash(
      BigInt.fromI32(badgeNumberStart + 1).toString()
    );
    let encoded = _concatBytes32(leftLeaf, rightLeaf);
    let hash = changetype<Bytes>(crypto.keccak256(encoded));

    let node = new MerkleNode(hash.toHex()) as MerkleNode;
    node.hash = hash;
    node.childEncoding = changetype<Bytes>(encoded);
    node.depth = depth;
    node.index = badgeNumberStart / 2;
    node.save();

    return hash;
  }
}

function _concatBytes32(firstBytes: Bytes, secondBytes: Bytes): Bytes {
  let fullBytes = Bytes.fromHexString(
    firstBytes
      .toHex()
      .concat(
        "5555555555555555555555555555555555555555555555555555555555555555"
      )
  );
  for (let i = 0; i < 32; i++) {
    fullBytes.fill(secondBytes[i], i + 32, i + 33);
  }
  return changetype<Bytes>(fullBytes);
}

function _leafIdToHash(leafId: string): Bytes {
  let leaf = EarnedBadgeCount.load(leafId) as EarnedBadgeCount;
  let earnedBadge = EarnedBadge.load(leaf.earnedBadge) as EarnedBadge;
  return changetype<Bytes>(earnedBadge.hash);
}

// The Graph's Assemblyscript Ethereum API doesn't appear to support packed encoding
// This function turns a BadgeWinner address + BadgeDefinition number into an Ethereum
// word identical to encoding an address with a uint8 using solidity's built in abi.encodePacked()
function _encodeLeaf(badgeWinner: string, badgeDefinitionId: i32): Bytes {
  let encodedLeaf = Bytes.fromHexString(badgeWinner.concat("00"));
  return changetype<Bytes>(encodedLeaf.fill(badgeDefinitionId, 20, 22));
}

function _hashLeaf(badgeWinner: string, badgeDefinitionId: i32): Bytes {
  return changetype<Bytes>(
    crypto.keccak256(_encodeLeaf(badgeWinner, badgeDefinitionId))
  );
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
