import { EntityStats, GraphAccount, Protocol } from "../../generated/schema";
import { createOrLoadBadgeUser } from "../Emblem/emblemModels";
import { PROTOCOL_NAME_THE_GRAPH, zeroBI } from "./constants";

export function createOrLoadEntityStats(): EntityStats {
  let entityStats = EntityStats.load("1");

  if (entityStats == null) {
    entityStats = new EntityStats("1");
    entityStats.indexerCount = 0;
    entityStats.delegatorCount = 0;
    entityStats.curatorCount = 0;
    entityStats.publisherCount = 0;
    entityStats.tokenLockWalletCount = 0;
    entityStats.earnedBadgeCount = 0;
    entityStats.badgeWinnerCount = 0;
    entityStats.badgeDefinitionCount = 0;
    entityStats.lastMerkledBadgeIndex = -1;

    entityStats.save();
  }

  return entityStats as EntityStats;
}

////////////////      GraphAccount

export function createOrLoadGraphAccount(address: string): GraphAccount {
  let graphAccount = GraphAccount.load(address);

  if (graphAccount == null) {
    createOrLoadBadgeUser(address);
    graphAccount = new GraphAccount(address);
    graphAccount.badgeUser = address;
    graphAccount.awardCount = 0;

    graphAccount.save();
  }

  return graphAccount as GraphAccount;
}

export function createOrLoadTheGraphProtocol(): Protocol {
  let protocol = Protocol.load(PROTOCOL_NAME_THE_GRAPH);

  if (protocol == null) {
    protocol = new Protocol(PROTOCOL_NAME_THE_GRAPH);
    protocol.save();
  }

  return protocol as Protocol;
}
