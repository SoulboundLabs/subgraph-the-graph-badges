import { BigInt } from "@graphprotocol/graph-ts/index";
import {
  BadgeAward,
  BadgeAwardCount,
  BadgeDefinition,
  BadgeStreakProperties,
  EntityStats,
  GraphAccount,
  Protocol,
  Publisher,
  Winner,
} from "../../generated/schema";
import { PROTOCOL_NAME_THE_GRAPH, zeroBI } from "./constants";
import { createOrLoadBadgeStreakDefinition } from "./streakManager";
import { toBigInt } from "./typeConverter";

export function createOrLoadEntityStats(): EntityStats {
  let entityStats = EntityStats.load("1");

  if (entityStats == null) {
    entityStats = new EntityStats("1");
    entityStats.indexerCount = 0;
    entityStats.delegatorCount = 0;
    entityStats.curatorCount = 0;
    entityStats.publisherCount = 0;
    entityStats.lastEraProcessed = toBigInt(0);
    entityStats.save();

    // _createTestBadgeAwards();     // awards badges to DAO and dev addresses
  }

  return entityStats as EntityStats;
}

////////////////      Winner

export function createOrLoadWinner(address: string): Winner {
  let winner = Winner.load(address);

  if (winner == null) {
    winner = new Winner(address);
    winner.badgeCount = 0;
    winner.mintedBadgeCount = 0;
    winner.lastSyncBlockNumber = zeroBI();
    winner.votingPower = zeroBI();

    winner.save();
  }

  return winner as Winner;
}

////////////////      GraphAccount

export function createOrLoadGraphAccount(address: string): GraphAccount {
  let graphAccount = GraphAccount.load(address);

  if (graphAccount == null) {
    createOrLoadWinner(address);
    graphAccount = new GraphAccount(address);
    graphAccount.winner = address;
    graphAccount.badgeCount = 0;
    graphAccount.votingPower = zeroBI();

    graphAccount.save();
  }

  return graphAccount as GraphAccount;
}

export function createOrLoadStreakProperties(
  delegator: string,
  startBlockNumber: BigInt,
  badgeAward: BadgeAward
): BadgeStreakProperties {
  let id = delegator.concat("-").concat(startBlockNumber.toString());

  let streakProps = BadgeStreakProperties.load(id);
  if (streakProps == null) {
    streakProps = new BadgeStreakProperties(id);
    streakProps.badgeAward = badgeAward.id;
    streakProps.streakStartBlock = startBlockNumber;
    streakProps.save();
  }
  return streakProps as BadgeStreakProperties;
}

export function createOrLoadBadgeAwardCount(
  badgeDefinition: BadgeDefinition,
  winnerId: string
): BadgeAwardCount {
  let id = badgeDefinition.id.concat("-").concat(winnerId);

  let badgeAwardCount = BadgeAwardCount.load(id);

  if (badgeAwardCount == null) {
    badgeAwardCount = new BadgeAwardCount(id);
    badgeAwardCount.winner = winnerId;
    badgeAwardCount.definition = badgeDefinition.id;
    badgeAwardCount.badgeCount = 0;
  }

  badgeAwardCount.badgeCount = badgeAwardCount.badgeCount + 1;
  badgeAwardCount.save();

  return badgeAwardCount as BadgeAwardCount;
}

export function createBadgeAward(
  badgeDefinition: BadgeDefinition,
  winnerId: string,
  blockNumber: BigInt
): void {
  // increment badgeCount
  badgeDefinition.badgeCount = badgeDefinition.badgeCount + 1;
  badgeDefinition.save();

  let badgeNumberString = BigInt.fromI32(badgeDefinition.badgeCount).toString();

  // award badge
  let badgeId = badgeDefinition.id.concat("-").concat(badgeNumberString);
  let badgeAward = BadgeAward.load(badgeId);

  let badgeAwardCount = createOrLoadBadgeAwardCount(badgeDefinition, winnerId);
  if (badgeAward == null) {
    badgeAward = new BadgeAward(badgeId);
    badgeAward.winner = winnerId;
    badgeAward.definition = badgeDefinition.id;
    badgeAward.blockAwarded = blockNumber;
    badgeAward.globalBadgeNumber = badgeDefinition.badgeCount;
    badgeAward.winnerBadgeNumber = badgeAwardCount.badgeCount;
    badgeAward.save();
  }

  _updateAccountWithBadgeAward(badgeAward as BadgeAward);
}

function _updateAccountWithBadgeAward(badgeAward: BadgeAward): void {
  let winner = createOrLoadWinner(badgeAward.winner);
  let graphAccount = createOrLoadGraphAccount(badgeAward.winner);
  winner.badgeCount = winner.badgeCount + 1;
  graphAccount.badgeCount = graphAccount.badgeCount + 1;
  let badgeDefinition = BadgeDefinition.load(badgeAward.definition);
  winner.votingPower = badgeDefinition.votingPower.plus(winner.votingPower);
  graphAccount.votingPower = badgeDefinition.votingPower.plus(
    graphAccount.votingPower
  );
  winner.save();
  graphAccount.save();
}

export function createOrLoadBadgeDefinition(
  name: string,
  description: string,
  voteWeight: BigInt,
  image: string,
  artist: string
): BadgeDefinition {
  let badgeDefinition = BadgeDefinition.load(name);

  if (badgeDefinition == null) {
    let protocol = createOrLoadTheGraphProtocol();

    badgeDefinition = new BadgeDefinition(name);
    badgeDefinition.protocol = protocol.id;
    badgeDefinition.description = description;
    badgeDefinition.image = image;
    badgeDefinition.artist = artist;
    badgeDefinition.votingPower = voteWeight;
    badgeDefinition.badgeCount = 0;

    badgeDefinition.save();
  }

  return badgeDefinition as BadgeDefinition;
}

export function createOrLoadBadgeDefinitionWithStreak(
  name: string,
  urlHandle: string,
  description: string,
  voteWeight: BigInt,
  image: string,
  artist: string,
  minimumStreak: BigInt
): BadgeDefinition {
  let badgeDefinition = BadgeDefinition.load(name);

  if (badgeDefinition == null) {
    badgeDefinition = createOrLoadBadgeDefinition(
      name,
      urlHandle,
      description,
      voteWeight,
      image,
      artist
    );

    createOrLoadBadgeStreakDefinition(name, minimumStreak);
  }

  return badgeDefinition as BadgeDefinition;
}

export function incrementBadgeCount(badgeName: string): BadgeDefinition {
  let badgeDefinition = BadgeDefinition.load(badgeName);
  badgeDefinition.badgeCount = badgeDefinition.badgeCount + 1;
  badgeDefinition.save();

  return badgeDefinition as BadgeDefinition;
}

export function createOrLoadTheGraphProtocol(): Protocol {
  let protocol = Protocol.load(PROTOCOL_NAME_THE_GRAPH);

  if (protocol == null) {
    protocol = new Protocol(PROTOCOL_NAME_THE_GRAPH);
    protocol.save();
  }

  return protocol as Protocol;
}
