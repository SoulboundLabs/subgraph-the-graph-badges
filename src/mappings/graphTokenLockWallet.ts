import { TokenLockCreated } from "../../generated/GraphTokenLockWalletManager/GraphTokenLockWalletManager";
import { log } from "@graphprotocol/graph-ts";
import { TokenLockWallet } from "../../generated/schema";

export function handleTokenLockCreated(event: TokenLockCreated): void {
  log.debug("TokenLockWalletCreated event found", []);
  let tokenLock = new TokenLockWallet(
    event.params.contractAddress.toHexString()
  );
  tokenLock.beneficiary = event.params.beneficiary.toHexString();
  tokenLock.save();
}

export function isTokenLockWallet(address: string): boolean {
  let isLockWallet = TokenLockWallet.load(address);
  return isLockWallet != null;
}

export function beneficiaryIfLockWallet(lockWalletId: string): string {
  let lockWallet = TokenLockWallet.load(lockWalletId);
  if (lockWallet != null) {
    return lockWallet.beneficiary;
  }
  else {
    return lockWalletId;
  }
}
