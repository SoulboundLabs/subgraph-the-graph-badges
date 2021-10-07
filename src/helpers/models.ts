import { BigInt, ethereum } from "@graphprotocol/graph-ts/index";
import {
  BadgeAward,
  BadgeAwardCount,
  BadgeDefinition,
  BadgeStreakProperties,
  EntityStats,
  GraphAccount,
  Protocol,
  TokenLockWallet,
  Winner,
} from "../../generated/schema";
import { isTokenLockWallet } from "../mappings/graphTokenLockWallet";
import { PROTOCOL_NAME_THE_GRAPH, zeroBI } from "./constants";
import { createOrLoadBadgeStreakDefinition } from "./streakManager";
import { toBigInt } from "./typeConverter";

export function createOrLoadEntityStats(): EntityStats {
  let entityStats = EntityStats.load("1");

  if (entityStats == null) {
    entityStats = new EntityStats("1");
    entityStats.voterCount = 0;
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

export class EventDataForBadgeAward {
  readonly blockNumber: BigInt;
  readonly transactionHash: string;
  readonly timestamp: BigInt;
  constructor(event: ethereum.Event) {
    this.blockNumber = event.block.number;
    this.transactionHash = event.transaction.hash.toHexString();
    this.timestamp = event.block.timestamp;
  }
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
  eventData: EventDataForBadgeAward
): void {
  let winnerAddress = _modifiedWinnerAddressIfNeeded(winnerId);
  // increment badgeCount
  badgeDefinition.badgeCount = badgeDefinition.badgeCount + 1;
  badgeDefinition.save();

  let badgeNumberString = BigInt.fromI32(badgeDefinition.badgeCount).toString();

  // award badge
  let badgeId = badgeDefinition.id.concat("-").concat(badgeNumberString);
  let badgeAward = BadgeAward.load(badgeId);

  let badgeAwardCount = createOrLoadBadgeAwardCount(
    badgeDefinition,
    winnerAddress
  );
  if (badgeAward == null) {
    badgeAward = new BadgeAward(badgeId);
    badgeAward.winner = winnerAddress;
    badgeAward.definition = badgeDefinition.id;
    badgeAward.blockAwarded = eventData.blockNumber;
    badgeAward.transactionHash = eventData.transactionHash;
    badgeAward.timestampAwarded = eventData.timestamp;
    badgeAward.globalBadgeNumber = badgeDefinition.badgeCount;
    badgeAward.winnerBadgeNumber = badgeAwardCount.badgeCount;
    badgeAward.save();
  }

  _updateAccountWithBadgeAward(badgeAward as BadgeAward);
}

// if the winner was a GRT vesting contract, award badge to beneficiary
function _modifiedWinnerAddressIfNeeded(address: string): string {
  let adr = address;
  if (isTokenLockWallet(address)) {
    adr = TokenLockWallet.load(address).beneficiary;
  }
  return adr;
}

function _updateAccountWithBadgeAward(badgeAward: BadgeAward): void {
  let winner = createOrLoadWinner(badgeAward.winner);
  let graphAccount = createOrLoadGraphAccount(badgeAward.winner);
  winner.badgeCount = winner.badgeCount + 1;
  graphAccount.badgeCount = graphAccount.badgeCount + 1;
  let badgeDefinition = BadgeDefinition.load(badgeAward.definition);
  let badgeVotingPower = badgeDefinition.votingPower;
  if (badgeVotingPower.gt(zeroBI())) {
    // winner just earned their first voting power
    if (winner.votingPower.equals(zeroBI())) {
      let entityStats = createOrLoadEntityStats();
      entityStats.voterCount = entityStats.voterCount + 1;
      entityStats.save();
    }
    winner.votingPower = badgeDefinition.votingPower.plus(winner.votingPower);
    graphAccount.votingPower = badgeDefinition.votingPower.plus(
      graphAccount.votingPower
    );
  }

  winner.save();
  graphAccount.save();
}

export function createOrLoadBadgeDefinition(
  name: string,
  description: string,
  voteWeight: BigInt,
  artist: string,
  image: string,
  protocolRole: string
): BadgeDefinition {
  let badgeDefinition = BadgeDefinition.load(name);

  if (badgeDefinition == null) {
    let protocol = createOrLoadTheGraphProtocol();

    badgeDefinition = new BadgeDefinition(name);
    badgeDefinition.protocol = protocol.id;
    badgeDefinition.description = description;
    badgeDefinition.image = image;
    badgeDefinition.artist = artist;
    badgeDefinition.protocolRole = protocolRole;
    badgeDefinition.votingPower = voteWeight;
    badgeDefinition.badgeCount = 0;

    badgeDefinition.save();
  }

  return badgeDefinition as BadgeDefinition;
}

export function createOrLoadBadgeDefinitionWithStreak(
  name: string,
  description: string,
  voteWeight: BigInt,
  artist: string,
  image: string,
  minimumStreak: BigInt,
  protocolRole: string
): BadgeDefinition {
  let badgeDefinition = BadgeDefinition.load(name);

  if (badgeDefinition == null) {
    badgeDefinition = createOrLoadBadgeDefinition(
      name,
      description,
      voteWeight,
      artist,
      image,
      protocolRole
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
