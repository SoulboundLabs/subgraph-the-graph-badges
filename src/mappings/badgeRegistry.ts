import {
  BadgeAdded,
  BadgeMinted,
  BadgeRecipientAdded,
  BadgeRecipientDisputed
} from "../types/BadgeRegistry/BadgeRegistry";

/**
 * @dev Emitted when `indexer` update the delegation parameters for its delegation pool.
 * Parameters:
 *   address indexer
 *   uint32 indexingRewardCut
 *   uint32 queryFeeCut
 *   uint32 cooldownBlocks
 */
export function handleBadgeAdded(event: BadgeAdded): void {}
export function handleBadgeRecipientAdded(event: BadgeRecipientAdded): void {}
export function handleBadgeMinted(event: BadgeMinted): void {}
export function handleBadgeRecipientDisputed(
  event: BadgeRecipientDisputed
): void {}
