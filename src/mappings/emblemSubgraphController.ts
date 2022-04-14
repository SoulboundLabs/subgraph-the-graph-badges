import { log } from "@graphprotocol/graph-ts";
import {
  SoulboundBadgeDefinitionCreated,
  SoulboundBadgeMerkleRootPosted,
} from "../../generated/EmblemSubgraphController/EmblemSubgraphController";
import { processSoulboundBadgeDefinitionCreated } from "../Emblem/emblemModels";
import { processSoulboundBadgeMerkleRootPosted } from "../Emblem/merkle";

export function handleSoulboundBadgeDefinitionCreated(
  event: SoulboundBadgeDefinitionCreated
): void {
  log.debug("SoulboundBadgeDefinitionCreated event found", []);
  processSoulboundBadgeDefinitionCreated(event);
}

export function handleSoulboundBadgeMerkleRootPosted(
  event: SoulboundBadgeMerkleRootPosted
): void {
  log.debug("SoulboundBadgeMerkleRootPosted event found", []);
  processSoulboundBadgeMerkleRootPosted(event);
}
