import { NSignalMinted, NSignalBurned } from "../../generated/GNS/GNS";
import { processUniqueSignalForPlanetOfTheAped } from "../Badges/planetOfTheAped";
import { BigDecimal, BigInt } from "@graphprotocol/graph-ts/index";
import { Curator, NameSignal } from "../../generated/schema";
import { createOrLoadEntityStats } from "./models";
import { processCurationBurnForSubgraphShark } from "../Badges/subgraphShark";
import { zeroBD } from "./constants";
import { log } from "@graphprotocol/graph-ts";
import { syncAllStreaksForWinners } from "./streakManager";
import { processNewCuratorForCuratorTribeBadge } from "../Badges/curatorTribe";

////////////////      Public

export function processCurationSignal(event: NSignalMinted): void {
  let subgraphOwner = event.params.graphAccount.toHexString();
  let subgraphNumber = event.params.subgraphNumber.toString();
  let curatorId = event.params.nameCurator.toHexString();
  let nSignal = event.params.nSignalCreated;
  let vSignal = event.params.vSignalCreated.toBigDecimal();
  let tokensDeposited = event.params.tokensDeposited;
  _processCurationSignal(
    subgraphOwner,
    subgraphNumber,
    curatorId,
    nSignal,
    vSignal,
    tokensDeposited,
    event.block.number
  );
}

export function processCurationBurn(event: NSignalBurned): void {
  let subgraphOwner = event.params.graphAccount.toHexString();
  let subgraphNumber = event.params.subgraphNumber.toString();
  let curatorId = event.params.nameCurator.toHexString();
  let nSignalBurnt = event.params.nSignalBurnt;
  let vSignalBurnt = event.params.vSignalBurnt.toBigDecimal();
  let tokensReceived = event.params.tokensReceived;
  _processCurationBurn(
    subgraphOwner,
    subgraphNumber,
    curatorId,
    nSignalBurnt,
    vSignalBurnt,
    tokensReceived,
    event.block.number
  );
}

////////////////      Event Processing

function _processCurationSignal(
  subgraphOwner: string,
  subgraphNumber: string,
  curatorId: string,
  nSignal: BigInt,
  vSignal: BigDecimal,
  tokensDeposited: BigInt,
  blockNumber: BigInt
): void {
  syncAllStreaksForWinners([subgraphOwner, curatorId], blockNumber);

  let subgraphId = subgraphOwner.concat("-").concat(subgraphNumber);
  let curator = _createOrLoadCurator(curatorId, blockNumber);
  let nameSignal = createOrLoadNameSignal(curatorId, subgraphId);

  let isNameSignalBecomingActive =
    nameSignal.nameSignal.isZero() && !nSignal.isZero();
  if (isNameSignalBecomingActive) {
    _broadcastUniqueCurationSignal(curator, subgraphId, blockNumber);
  }

  nameSignal.nameSignal = nameSignal.nameSignal.plus(nSignal);
  nameSignal.signal = nameSignal.signal.plus(vSignal);
  nameSignal.signalledTokens = nameSignal.signalledTokens.plus(tokensDeposited);

  // nSignal
  nameSignal.nameSignalAverageCostBasis =
    nameSignal.nameSignalAverageCostBasis.plus(tokensDeposited.toBigDecimal());

  // zero division protection
  if (nameSignal.nameSignal.toBigDecimal() != zeroBD()) {
    nameSignal.nameSignalAverageCostBasisPerSignal =
      nameSignal.nameSignalAverageCostBasis
        .div(tokensDeposited.toBigDecimal())
        .truncate(18);
  }

  // vSignal
  nameSignal.signalAverageCostBasis = nameSignal.signalAverageCostBasis.plus(
    tokensDeposited.toBigDecimal()
  );

  // zero division protection
  if (nameSignal.signal != zeroBD()) {
    nameSignal.signalAverageCostBasisPerSignal =
      nameSignal.signalAverageCostBasis.div(nameSignal.signal).truncate(18);
  }
  nameSignal.save();
}

function _processCurationBurn(
  subgraphOwner: string,
  subgraphNumber: string,
  curatorId: string,
  nSignalBurnt: BigInt,
  vSignalBurnt: BigDecimal,
  tokensReceived: BigInt,
  blockNumber: BigInt
): void {
  syncAllStreaksForWinners([subgraphOwner, curatorId], blockNumber);

  let subgraphId = subgraphOwner.concat("-").concat(subgraphNumber);
  let curator = _createOrLoadCurator(curatorId, blockNumber);

  let nameSignal = createOrLoadNameSignal(curatorId, subgraphId);

  nameSignal.nameSignal = nameSignal.nameSignal.minus(nSignalBurnt);
  nameSignal.signal = nameSignal.signal.minus(vSignalBurnt);
  nameSignal.unsignalledTokens =
    nameSignal.unsignalledTokens.plus(tokensReceived);

  // nSignal ACB
  // update acb to reflect new name signal balance
  let previousACBNameSignal = nameSignal.nameSignalAverageCostBasis;
  nameSignal.nameSignalAverageCostBasis = nameSignal.nameSignal
    .toBigDecimal()
    .times(nameSignal.nameSignalAverageCostBasisPerSignal)
    .truncate(18);

  _broadcastCurationBurn(
    curator,
    previousACBNameSignal,
    nameSignal.nameSignalAverageCostBasis,
    blockNumber
  );

  if (nameSignal.nameSignalAverageCostBasis == BigDecimal.fromString("0")) {
    nameSignal.nameSignalAverageCostBasisPerSignal = BigDecimal.fromString("0");
  }
  nameSignal.save();
}

////////////////      Broadcasting

function _broadcastFirstTimeCurator(
  curatorId: string,
  blockNumber: BigInt
): void {
  processNewCuratorForCuratorTribeBadge(curatorId, blockNumber);
}

function _broadcastUniqueCurationSignal(
  curator: Curator,
  subgraphId: string,
  blockNumber: BigInt
): void {
  log.debug(
    "broadcasting unique curation signal---\ncurator: {}\nsubgraphId: {}\n",
    [curator.id, subgraphId]
  );

  processUniqueSignalForPlanetOfTheAped(curator, subgraphId, blockNumber);
}

function _broadcastCurationBurn(
  curator: Curator,
  oldACB: BigDecimal,
  currentACB: BigDecimal,
  blockNumber: BigInt
): void {
  log.debug(
    "broadcasting curation burn---\noldACB: {}\ncurrentACB: {}\ncurator: {}\n",
    [oldACB.toString(), currentACB.toString(), curator.id]
  );

  processCurationBurnForSubgraphShark(curator, oldACB, currentACB, blockNumber);
}

////////////////      Models

function _createOrLoadCurator(id: string, blockNumber: BigInt): Curator {
  let curator = Curator.load(id);

  if (curator == null) {
    curator = new Curator(id);
    curator.account = id;
    curator.uniqueSignalCount = 0;
    curator.save();

    let entityStats = createOrLoadEntityStats();
    let curatorCount = entityStats.curatorCount + 1;
    entityStats.curatorCount = curatorCount;
    entityStats.save();

    _broadcastFirstTimeCurator(id, blockNumber);
  }

  return curator as Curator;
}

export function createOrLoadNameSignal(
  curatorId: string,
  subgraphId: string
): NameSignal {
  let nameSignalID = curatorId.concat("-").concat(subgraphId);
  let nameSignal = NameSignal.load(nameSignalID);
  if (nameSignal == null) {
    nameSignal = new NameSignal(nameSignalID);
    let curator = Curator.load(curatorId);
    nameSignal.curator = curator.id;
    nameSignal.subgraphId = subgraphId;
    nameSignal.signalledTokens = BigInt.fromI32(0);
    nameSignal.unsignalledTokens = BigInt.fromI32(0);
    nameSignal.nameSignal = BigInt.fromI32(0);
    nameSignal.signal = BigDecimal.fromString("0");
    nameSignal.nameSignalAverageCostBasis = BigDecimal.fromString("0");
    nameSignal.nameSignalAverageCostBasisPerSignal = BigDecimal.fromString("0");
    nameSignal.signalAverageCostBasis = BigDecimal.fromString("0");
    nameSignal.signalAverageCostBasisPerSignal = BigDecimal.fromString("0");
    nameSignal.save();

    curator.uniqueSignalCount = curator.uniqueSignalCount + 1;
    curator.save();
  }
  return nameSignal as NameSignal;
}
