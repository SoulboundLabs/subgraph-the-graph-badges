import * as networkAddresses from "@graphprotocol/contracts/addresses.json";
import * as fs from "fs";
import * as mustache from "mustache";
import { Addresses } from "./addresses.template";

// mustache doesn't like numbered object keys
let renameAddresses: any = networkAddresses;
renameAddresses["mainnet"] = networkAddresses["1"];

export let addresses: Addresses = {
  controller: "{{mainnet.Controller.address}}",
  graphToken: "{{mainnet.GraphToken.address}}",
  epochManager: "{{mainnet.EpochManager.address}}",
  disputeManager: "{{mainnet.DisputeManager.address}}",
  staking: "{{mainnet.Staking.address}}",
  curation: "{{mainnet.Curation.address}}",
  rewardsManager: "{{mainnet.RewardsManager.address}}",
  serviceRegistry: "{{mainnet.ServiceRegistry.address}}",
  gns: "{{mainnet.GNS.address}}",
  ens: "{{mainnet.IENS.address}}",
  ensPublicResolver: "{{mainnet.IPublicResolver}}",
  blockNumber: "",
  network: "",
  graphTokenLockWalletManager1: "0xfcf78ac094288d7200cfdb367a8cd07108dfa128",
  graphTokenLockWalletManager2: "0x6284042d4da0931cbc64c5aab2d6184403095883",
};

const main = (): void => {
  try {
    let output = JSON.parse(
      mustache.render(JSON.stringify(addresses), renameAddresses)
    );
    output.blockNumber = "11440000"; // Hardcoded a few thousand blocks before 1st contract deployed
    output.network = "mainnet";
    fs.writeFileSync(
      __dirname + "/generatedAddresses.json",
      JSON.stringify(output, null, 2)
    );
  } catch (e) {
    console.log(`Error saving artifacts: ${e.message}`);
  }
};

main();
