/**
 * This mapping handles the events from the Curation contract
 * https://github.com/graphprotocol/contracts/blob/master/contracts/curation/Curation.sol
 */

import {
  SubgraphPublished,
  NSignalMinted,
  NSignalBurned,
} from "../../generated/GNS/GNS";
import { processSubgraphPublished } from "../helpers/subgraphManager";
import { Subgraph } from "../../generated/schema";
import { log } from "@graphprotocol/graph-ts";

export function handleSubgraphPublished(event: SubgraphPublished): void {
  log.debug("SubgraphPublished event found", []);
  processSubgraphPublished(event);
}

// export function handleNSSignalMinted(event: NSignalMinted): void {

// }

// export function handleNSignalBurned(event: NSignalBurned): void {
//   let graphAccount = event.params.graphAccount.toHexString()
//   let subgraph = Subgraph.load();
// }

// function _processSignalMinted(

// ): void {

// }

// function _processSignalBurned(

// ): void {

// }
