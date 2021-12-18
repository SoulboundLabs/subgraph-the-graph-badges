import { NSignalMinted, NSignalBurned } from "../../generated/GNS/GNS";
import { BigDecimal, BigInt } from "@graphprotocol/graph-ts/index";
import { Curator, NameSignal, Subgraph, Publisher } from "../../generated/schema";
import { createOrLoadEntityStats, EventDataForBadgeAward } from "./models";
import { zeroBD, BADGE_TRACK_CURATOR_SUBGRAPHS, BADGE_TRACK_DEVELOPER_SIGNAL, BADGE_TRACK_CURATOR_HOUSE_ODDS, BADGE_TRACK_CURATOR_PLANET_OF_THE_APED } from "./constants";
import { incrementProgressForTrack, updateProgressForTrack } from "../Badges/standardTrackBadges";
import { log } from "@graphprotocol/graph-ts";

////////////////      Public

export function processCurationSignal(event: NSignalMinted): void {
  let subgraphOwner = event.params.graphAccount.toHexString();
  let subgraphNumber = event.params.subgraphNumber.toString();
  let curatorId = event.params.nameCurator.toHexString();
  let nSignal = event.params.nSignalCreated;
  let vSignal = event.params.vSignalCreated.toBigDecimal();
  let tokensDeposited = event.params.tokensDeposited;
  let eventData = new EventDataForBadgeAward(event);
  _processCurationSignal(
    subgraphOwner,
    subgraphNumber,
    curatorId,
    nSignal,
    vSignal,
    tokensDeposited,
    eventData
  );
}

export function processCurationBurn(event: NSignalBurned): void {
  let subgraphOwner = event.params.graphAccount.toHexString();
  let subgraphNumber = event.params.subgraphNumber.toString();
  let curatorId = event.params.nameCurator.toHexString();
  let nSignalBurnt = event.params.nSignalBurnt;
  let vSignalBurnt = event.params.vSignalBurnt.toBigDecimal();
  let tokensReceived = event.params.tokensReceived;
  let eventData = new EventDataForBadgeAward(event);
  _processCurationBurn(
    subgraphOwner,
    subgraphNumber,
    curatorId,
    nSignalBurnt,
    vSignalBurnt,
    tokensReceived,
    eventData
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
  eventData: EventDataForBadgeAward
): void {
  let subgraphId = subgraphOwner.concat("-").concat(subgraphNumber);
  let nameSignal = createOrLoadNameSignal(curatorId, subgraphId, eventData);

  let isNameSignalBecomingActive =
    nameSignal.nameSignal.isZero() && !nSignal.isZero();
  if (isNameSignalBecomingActive) {
    incrementProgressForTrack(BADGE_TRACK_CURATOR_SUBGRAPHS, curatorId, eventData);
    let subgraph = Subgraph.load(subgraphId) as Subgraph;
    let curatorIsSubgraphOwner = subgraphOwner == curatorId;
    
    if (eventData.blockNumber.minus(subgraph.blockPublished).le(BigInt.fromI32(100))
    && !curatorIsSubgraphOwner) {
      incrementProgressForTrack(BADGE_TRACK_CURATOR_PLANET_OF_THE_APED, curatorId, eventData);
    }

    if (curatorIsSubgraphOwner) {
      incrementProgressForTrack(BADGE_TRACK_CURATOR_HOUSE_ODDS, curatorId, eventData);
    }
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

  let publisher = Publisher.load(subgraphOwner);
  publisher.currentCurationTokens = publisher.currentCurationTokens.plus(tokensDeposited);
  publisher.save();
  updateProgressForTrack(BADGE_TRACK_DEVELOPER_SIGNAL, subgraphOwner, publisher.currentCurationTokens, eventData);
}

function _processCurationBurn(
  subgraphOwner: string,
  subgraphNumber: string,
  curatorId: string,
  nSignalBurnt: BigInt,
  vSignalBurnt: BigDecimal,
  tokensReceived: BigInt,
  eventData: EventDataForBadgeAward
): void {
  let subgraphId = subgraphOwner.concat("-").concat(subgraphNumber);
  let nameSignal = createOrLoadNameSignal(curatorId, subgraphId, eventData);

  nameSignal.nameSignal = nameSignal.nameSignal.minus(nSignalBurnt);
  nameSignal.signal = nameSignal.signal.minus(vSignalBurnt);
  nameSignal.unsignalledTokens =
    nameSignal.unsignalledTokens.plus(tokensReceived);

  // nSignal ACB
  // update acb to reflect new name signal balance
  nameSignal.nameSignalAverageCostBasis = nameSignal.nameSignal
    .toBigDecimal()
    .times(nameSignal.nameSignalAverageCostBasisPerSignal)
    .truncate(18);

  if (nameSignal.nameSignalAverageCostBasis == BigDecimal.fromString("0")) {
    nameSignal.nameSignalAverageCostBasisPerSignal = BigDecimal.fromString("0");
  }
  nameSignal.save();

  let publisher = Publisher.load(subgraphOwner);
  publisher.currentCurationTokens = publisher.currentCurationTokens.minus(tokensReceived);
  publisher.save();

  updateProgressForTrack(BADGE_TRACK_DEVELOPER_SIGNAL, subgraphOwner, publisher.currentCurationTokens, eventData);
}

////////////////      Models

function _createOrLoadCurator(
  id: string,
  eventData: EventDataForBadgeAward
): Curator {
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
  }

  return curator as Curator;
}

export function createOrLoadNameSignal(
  curatorId: string,
  subgraphId: string,
  eventData: EventDataForBadgeAward
): NameSignal {
  let nameSignalID = curatorId.concat("-").concat(subgraphId);
  let nameSignal = NameSignal.load(nameSignalID);
  if (nameSignal == null) {
    nameSignal = new NameSignal(nameSignalID);
    let curator = _createOrLoadCurator(curatorId, eventData);
    nameSignal.curator = curatorId;
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
