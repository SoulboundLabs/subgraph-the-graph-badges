/**
 * This mapping handles the events from the Curation contract
 * https://github.com/graphprotocol/contracts/blob/master/contracts/curation/Curation.sol
 */

import { Signalled, Burned } from "../../generated/Curation/Curation";
import { log } from "@graphprotocol/graph-ts";
import {
  processCurationBurn,
  processCurationSignal,
} from "../helpers/curationManager";

export function handleCurationSignal(event: Signalled): void {
  log.debug("Signalled event found", []);
  processCurationSignal(event);
}

export function handleCurationBurn(event: Burned): void {
  log.debug("Burned event found", []);
  processCurationBurn(event);
}
