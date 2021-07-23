import { Signalled, Burned } from "../../generated/Curation/Curation";
import { processUniqueSignalForSubgraphConnoisseur } from "../Badges/SubgraphConnoisseur";
import { BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts/index";
import {
  Curator,
  SignalledStake
} from "../../generated/schema";
import {
  createOrLoadEntityStats
} from "./models";
import { processCurationBurnForSubgraphShark } from "../Badges/subgraphShark";


export function processCurationSignal(event: Signalled): void {
  let curatorId = event.params.curator.toHexString();
  let subgraphId = event.params.subgraphDeploymentID.toHexString();
  let signal = event.params.signal;
  let tokens = event.params.tokens;
  let blockNumber = event.block.number;

  _processCurationSignal(
    curatorId,
    subgraphId,
    signal,
    tokens,
    blockNumber
  );
}

export function processCurationBurn(
  event: Burned
): void {
  let curatorId = event.params.curator.toHexString();
  let subgraphId = event.params.subgraphDeploymentID.toHexString();
  let signal = event.params.signal;
  let tokens = event.params.tokens;
  let blockNumber = event.block.number;
  _processCurationBurn(curatorId, subgraphId, tokens, signal, blockNumber);
}

export function createOrLoadCurator(id: string): Curator {
  let curator = Curator.load(id);

  if (curator == null) {
    curator = new Curator(id);
    curator.uniqueSignalCount = 0;
    curator.save();

    let entityStats = createOrLoadEntityStats();
    let curatorCount = entityStats.curatorCount + 1;
    entityStats.curatorCount = curatorCount;
    entityStats.save();
  }

  return curator as Curator;
}

/* private functions */

function _processCurationSignal(
  curatorId: string,
  subgraphId: string,
  signal: BigInt,
  tokens: BigInt,
  blockNumber: BigInt
): void {
  let id = curatorId.concat("-").concat(subgraphId);
  let signalledStake = SignalledStake.load(id);
  if (signalledStake == null) {
    signalledStake = _createSignalledStake(id, curatorId, subgraphId, tokens, signal);
    let curator = createOrLoadCurator(curatorId);
    curator.uniqueSignalCount = curator.uniqueSignalCount + 1;
    curator.save();
    
    _broadcastUniqueCurationSignal(curator, blockNumber);
  }
  else {
    signalledStake.tokenBalance = signalledStake.tokenBalance.plus(tokens);
    signalledStake.signal = signalledStake.signal.plus(signal);
    signalledStake.save();
  }
}

function _broadcastUniqueCurationSignal(
  curator: Curator, 
  blockNumber: BigInt
): void {
  processUniqueSignalForSubgraphConnoisseur(curator, blockNumber);
}

function _processCurationBurn(
  curatorId: string, 
  subgraphId: string, 
  tokens: BigInt,
  signal: BigInt,
  blockNumber: BigInt
): void {
  let id = curatorId.concat("-").concat(subgraphId);
  let signalledStake = SignalledStake.load(id);
  if (signalledStake != null) {
    let curator = createOrLoadCurator(curatorId);
    let avgCostBasis = signalledStake.signal.div(signalledStake.tokenBalance);
    let burnPrice = signal.div(tokens);
    signalledStake.signal = signalledStake.signal.minus(signal);
    signalledStake.tokenBalance = signalledStake.tokenBalance.minus(signal);
    signalledStake.save();

    _broadcastCurationBurn(curator, avgCostBasis, burnPrice, blockNumber);
  }
}

function _broadcastCurationBurn(
  curator: Curator,
  costBasis: BigInt, 
  burnPrice: BigInt, 
  blockNumber: BigInt
): void {
  processCurationBurnForSubgraphShark(curator, costBasis, burnPrice, blockNumber);
}

function _createSignalledStake(
  id: string,
  curator: string,
  subgraph: string,
  tokens: BigInt,
  signal: BigInt
): SignalledStake {

  let signalledStake = new SignalledStake(id);
  signalledStake.curator = curator;
  signalledStake.subgraphId = subgraph;
  signalledStake.tokenBalance = tokens;
  signalledStake.signal = signal;
  signalledStake.save();

  return signalledStake;
}