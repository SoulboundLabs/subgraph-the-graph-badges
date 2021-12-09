import { processRewardsAssigned } from "../helpers/indexerManager";
import { log } from "@graphprotocol/graph-ts";
import { RewardsAssigned } from '../../generated/RewardsManager/RewardsManager'


export function handleRewardsAssigned(event: RewardsAssigned): void {
  log.debug("RewardsAssigned event found", []);
  processRewardsAssigned(event);
}