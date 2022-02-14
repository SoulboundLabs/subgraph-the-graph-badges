import { TokenLockCreated } from "../../generated/GraphTokenLockWalletManager/GraphTokenLockWalletManager";
import { log } from "@graphprotocol/graph-ts";
import { TokenLockWallet } from "../../generated/schema";
import { createOrLoadTheGraphEntityStats } from "../helpers/models";
import { generateGenesisBadgeDefinitions } from "../Emblem/genesisBadges";

export function handleTokenLockCreated(event: TokenLockCreated): void {
  log.debug("TokenLockWalletCreated event found", []);
  let tokenLock = new TokenLockWallet(
    event.params.contractAddress.toHexString()
  );
  tokenLock.beneficiary = event.params.beneficiary.toHexString();
  tokenLock.save();

  let entityStats = createOrLoadTheGraphEntityStats();
  entityStats.tokenLockWalletCount = entityStats.tokenLockWalletCount + 1;
  entityStats.save();

  // one time set up for genesis badge definitions happens here because
  // lock wallet generations are the earliest events the subgraph picks up
  if (entityStats.tokenLockWalletCount == 1) {
    generateGenesisBadgeDefinitions();
  }
}

export function isTokenLockWallet(address: string): boolean {
  let isLockWallet = TokenLockWallet.load(address);
  return isLockWallet != null;
}

export function beneficiaryIfLockWallet(lockWalletId: string): string {
  let lockWallet = TokenLockWallet.load(lockWalletId);
  if (lockWallet != null) {
    return lockWallet.beneficiary;
  } else {
    return lockWalletId;
  }
}
