import {
  GraphAccount,
  SoulboundProtocol,
  TheGraphEntityStats,
} from "../../generated/schema";
import {
  createOrLoadSoulboundStats,
  createOrLoadSoulboundUser,
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

    createOrLoadSoulboundStats();
  }

  return entityStats as TheGraphEntityStats;
}

////////////////      GraphAccount

export function createOrLoadGraphAccount(address: string): GraphAccount {
  let graphAccount = GraphAccount.load(address);

  if (graphAccount == null) {
    createOrLoadSoulboundUser(address);
    graphAccount = new GraphAccount(address);
    graphAccount.soulboundUser = address;
    graphAccount.awardCount = 0;

    graphAccount.save();
  }

  return graphAccount as GraphAccount;
}

export function createOrLoadTheGraphSoulboundProtocol(): SoulboundProtocol {
  let protocol = SoulboundProtocol.load(PROTOCOL_NAME_THE_GRAPH);

  if (protocol == null) {
    protocol = new SoulboundProtocol(PROTOCOL_NAME_THE_GRAPH);
    protocol.save();
  }

  return protocol as SoulboundProtocol;
}
