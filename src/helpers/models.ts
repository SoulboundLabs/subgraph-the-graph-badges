import {
  TheGraphEntityStats,
  GraphAccount,
  Protocol,
} from "../../generated/schema";
import {
  createOrLoadEmblemUser,
  createOrLoadEmblemEntityStats,
} from "../Emblem/emblemModels";
import { PROTOCOL_NAME_THE_GRAPH } from "./../Emblem/metrics";

export function createOrLoadTheGraphEntityStats(): TheGraphEntityStats {
  let entityStats = TheGraphEntityStats.load("1");

  if (entityStats == null) {
    entityStats = new TheGraphEntityStats("1");
    entityStats.indexerCount = 0;
    entityStats.delegatorCount = 0;
    entityStats.curatorCount = 0;
    entityStats.publisherCount = 0;
    entityStats.tokenLockWalletCount = 0;

    entityStats.save();

    createOrLoadEmblemEntityStats();
  }

  return entityStats as TheGraphEntityStats;
}

////////////////      GraphAccount

export function createOrLoadGraphAccount(address: string): GraphAccount {
  let graphAccount = GraphAccount.load(address);

  if (graphAccount == null) {
    createOrLoadEmblemUser(address);
    graphAccount = new GraphAccount(address);
    graphAccount.emblemUser = address;
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
