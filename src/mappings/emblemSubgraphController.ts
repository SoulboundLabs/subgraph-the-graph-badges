import { log } from "@graphprotocol/graph-ts";
import {
  BadgeDefinitionCreated,
  MerkleRootPosted,
} from "../../generated/EmblemSubgraphController/EmblemSubgraphController";
import { processBadgeDefinitionCreated } from "../Emblem/emblemModels";
import { processMerkleRootPosted } from "../Emblem/merkle";

export function handleBadgeDefinitionCreated(
  event: BadgeDefinitionCreated
): void {
  log.debug("BadgeDefinitionCreated event found", []);
  processBadgeDefinitionCreated(event);
}

export function handleMerkleRootPosted(event: MerkleRootPosted): void {
  log.debug("MerkleRootPosted event found", []);
  processMerkleRootPosted(event);
}
