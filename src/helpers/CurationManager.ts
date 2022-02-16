import { BigDecimal, BigInt } from "@graphprotocol/graph-ts/index";
import { NSignalBurned, NSignalMinted } from "../../generated/GNS/GNS";
import { Curator, NameSignal, Subgraph } from "../../generated/schema";
import {
  EarnedBadgeEventData,
  EarnedBadgeEventMetadata,
} from "../Emblem/emblemModels";
import {
  addToProgress,
  incrementProgress,
  subtractFromProgress,
} from "../Emblem/metricProgress";
import { beneficiaryIfLockWallet } from "../mappings/graphTokenLockWallet";
import {
  BADGE_AWARD_METADATA_NAME_CURATOR,
  BADGE_AWARD_METADATA_NAME_SUBGRAPH,
  BADGE_AWARD_METADATA_NAME_TOKENS,
  BADGE_METRIC_CURATOR_APE,
  BADGE_METRIC_CURATOR_HOUSE_ODDS,
  BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
  BADGE_METRIC_PUBLISHER_SIGNAL_ATTRACTED,
} from "../Emblem/metrics";
import { createOrLoadTheGraphEntityStats } from "./models";
import { zeroBD } from "./constants";

////////////////      Public

export function processCurationSignal(event: NSignalMinted): void {
  let subgraphOwner = beneficiaryIfLockWallet(
    event.params.graphAccount.toHexString()
  );
  let subgraphNumber = event.params.subgraphNumber.toString();
  let curatorId = beneficiaryIfLockWallet(
    event.params.nameCurator.toHexString()
  );
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
    event
  );
}

export function processCurationBurn(event: NSignalBurned): void {
  let subgraphOwner = beneficiaryIfLockWallet(
    event.params.graphAccount.toHexString()
  );
  let subgraphNumber = event.params.subgraphNumber.toString();
  let curatorId = beneficiaryIfLockWallet(
    event.params.nameCurator.toHexString()
  );
  let nSignalBurnt = event.params.nSignalBurnt;
  let vSignalBurnt = event.params.vSignalBurnt.toBigDecimal();
  let tokensReceived = event.params.tokensReceived;
  let eventData = new EarnedBadgeEventData(event, []);
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
  event: NSignalMinted
): void {
  let subgraphId = subgraphOwner.concat("-").concat(subgraphNumber);
  let metadata: Array<EarnedBadgeEventMetadata> = [
    new EarnedBadgeEventMetadata(
      BADGE_AWARD_METADATA_NAME_TOKENS,
      tokensDeposited.toString()
    ),
    new EarnedBadgeEventMetadata(BADGE_AWARD_METADATA_NAME_CURATOR, curatorId),
    new EarnedBadgeEventMetadata(
      BADGE_AWARD_METADATA_NAME_SUBGRAPH,
      subgraphOwner.concat("-").concat(subgraphNumber)
    ),
  ];
  let eventData = new EarnedBadgeEventData(event, metadata);
  let nameSignal = createOrLoadNameSignal(curatorId, subgraphId, eventData);

  let isNameSignalBecomingActive =
    nameSignal.nameSignal.isZero() && !nSignal.isZero();
  if (isNameSignalBecomingActive) {
    incrementProgress(
      curatorId,
      BADGE_METRIC_CURATOR_SUBGRAPHS_SIGNALLED,
      eventData
    );

    let subgraph = Subgraph.load(subgraphId) as Subgraph;
    let curatorIsSubgraphOwner = subgraphOwner == curatorId;

    if (
      eventData.blockNumber
        .minus(subgraph.blockPublished)
        .le(BigInt.fromI32(100)) &&
      !curatorIsSubgraphOwner
    ) {
      incrementProgress(curatorId, BADGE_METRIC_CURATOR_APE, eventData);
    }

    if (curatorIsSubgraphOwner) {
      incrementProgress(curatorId, BADGE_METRIC_CURATOR_HOUSE_ODDS, eventData);
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

  addToProgress(
    subgraphOwner,
    BADGE_METRIC_PUBLISHER_SIGNAL_ATTRACTED,
    tokensDeposited,
    eventData
  );
}

function _processCurationBurn(
  subgraphOwner: string,
  subgraphNumber: string,
  curatorId: string,
  nSignalBurnt: BigInt,
  vSignalBurnt: BigDecimal,
  tokensReceived: BigInt,
  eventData: EarnedBadgeEventData
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

  subtractFromProgress(
    subgraphOwner,
    BADGE_METRIC_PUBLISHER_SIGNAL_ATTRACTED,
    tokensReceived,
    eventData
  );
}

////////////////      Models

function _createOrLoadCurator(
  id: string,
  eventData: EarnedBadgeEventData
): Curator {
  let curator = Curator.load(id);

  if (curator == null) {
    curator = new Curator(id);
    curator.account = id;
    curator.uniqueSignalCount = 0;
    curator.save();

    let entityStats = createOrLoadTheGraphEntityStats();
    let curatorCount = entityStats.curatorCount + 1;
    entityStats.curatorCount = curatorCount;
    entityStats.save();
  }

  return curator as Curator;
}

export function createOrLoadNameSignal(
  curatorId: string,
  subgraphId: string,
  eventData: EarnedBadgeEventData
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
