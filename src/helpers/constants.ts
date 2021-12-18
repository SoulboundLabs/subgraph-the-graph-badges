import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export function subgraphName(): string {
  return "TheGraphBadges";
}

export function badgeOverviewId(): string {
  return "BadgeOverview"; // Singleton ID for BadgeStats entity
}

export function zeroBD(): BigDecimal {
  return BigDecimal.fromString("0");
}

export function oneBD(): BigDecimal {
  return BigDecimal.fromString("1");
}

export function sixteenBD(): BigDecimal {
  return BigDecimal.fromString("16");
}

export function protocolGenesis(): BigInt {
  return BigInt.fromString("1607844057"); // Timestamp for Ethereum Block #11446786
}

export function zeroBI(): BigInt {
  return BigInt.fromI32(0);
}

export function oneBI(): BigInt {
  return BigInt.fromI32(1);
}

export function negOneBI(): BigInt {
  return BigInt.fromI32(-1);
}

export function oneDay(): BigInt {
  return BigInt.fromI32(60 * 60 * 24);
}

export function minimumDelegationStreak(): BigInt {
  return BigInt.fromI32(100000); // measured in blocks
}

export const PROTOCOL_NAME_THE_GRAPH = "The Graph";

export const PROTOCOL_ROLE_INDEXER = "Indexer";
export const PROTOCOL_ROLE_DELEGATOR = "Delegator";
export const PROTOCOL_ROLE_CURATOR = "Curator";
export const PROTOCOL_ROLE_SUBGRAPH_DEVELOPER = "Subgraph Developer";


/////////// INDEXER BADGE TRACKS //////////////

export const BADGE_TRACK_INDEXER_SUBGRAPHS = "Indexing on Subgraphs";
const BADGE_TRACK_INDEXER_SUBGRAPHS_ROLE = PROTOCOL_ROLE_INDEXER;
const BADGE_TRACK_INDEXER_SUBGRAPHS_THRESHOLDS = ["1","5","15","50"] as string[];
const BADGE_TRACK_INDEXER_SUBGRAPHS_DESCRIPTIONS = ["description1", "description2", "description3", "description4"] as string[];

export const BADGE_TRACK_INDEXER_DISTRIBUTING = "GRT Distributed to Delegators";
const BADGE_TRACK_INDEXER_DISTRIBUTING_ROLE = PROTOCOL_ROLE_INDEXER;
const BADGE_TRACK_INDEXER_DISTRIBUTING_THRESHOLDS = ["10000000000000000000000","100000000000000000000000","1000000000000000000000000","10000000000000000000000000"] as string[];
const BADGE_TRACK_INDEXER_DISTRIBUTING_DESCRIPTIONS = ["description1", "description2", "description3", "description4"] as string[];

export const BADGE_TRACK_INDEXER_QUERY_FEE = "Query Fees Collected";
const BADGE_TRACK_INDEXER_QUERY_FEE_ROLE = PROTOCOL_ROLE_INDEXER;
const BADGE_TRACK_INDEXER_QUERY_FEE_THRESHOLDS = ["1000000000000000000000", "10000000000000000000000", "50000000000000000000000", "100000000000000000000000"] as string[];
const BADGE_TRACK_INDEXER_QUERY_FEE_DESCRIPTIONS = ["description1", "description2", "description3", "description4"] as string[];

export const BADGE_TRACK_INDEXER_ALLOCATIONS_OPENED = "Allocation Opener";
const BADGE_TRACK_INDEXER_ALLOCATIONS_OPENED_ROLE = PROTOCOL_ROLE_INDEXER;
const BADGE_TRACK_INDEXER_ALLOCATIONS_OPENED_THRESHOLDS = ["1", "5", "20"] as string[];
const BADGE_TRACK_INDEXER_ALLOCATIONS_OPENED_DESCRIPTIONS = ["description1", "description2", "description3"] as string[];

export const BADGE_TRACK_INDEXER_DELEGATOR_COUNT = "Number of delegators that have delegated to this indexer";
const BADGE_TRACK_INDEXER_DELEGATOR_COUNT_ROLE = PROTOCOL_ROLE_INDEXER;
const BADGE_TRACK_INDEXER_DELEGATOR_COUNT_THRESHOLDS = ["1", "30", "100"] as string[];
const BADGE_TRACK_INDEXER_DELEGATOR_COUNT_DESCRIPTIONS = ["description1", "description2", "description3"] as string[];


/////////// DELEGATOR BADGE TRACKS //////////////

export const BADGE_TRACK_DELEGATOR_INDEXERS = "Delegating to Indexers";
const BADGE_TRACK_DELEGATOR_INDEXERS_ROLE = PROTOCOL_ROLE_DELEGATOR;
const BADGE_TRACK_DELEGATOR_INDEXERS_THRESHOLDS = ["1", "3", "10", "25"] as string[];
const BADGE_TRACK_DELEGATOR_INDEXERS_DESCRIPTIONS = ["description1", "description2", "description3", "description4"] as string[];


/////////// CURATOR BADGE TRACKS //////////////

export const BADGE_TRACK_CURATOR_SUBGRAPHS = "Curating on Subgraphs";
const BADGE_TRACK_CURATOR_SUBGRAPHS_ROLE = PROTOCOL_ROLE_CURATOR;
const BADGE_TRACK_CURATOR_SUBGRAPHS_THRESHOLDS = ["1", "5", "15", "50"] as string[];
const BADGE_TRACK_CURATOR_SUBGRAPHS_DESCRIPTIONS = ["description1", "description2", "description3", "description4"] as string[];

export const BADGE_TRACK_CURATOR_HOUSE_ODDS = "First to curate on subgraphs published by the curator";
const BADGE_TRACK_CURATOR_HOUSE_ODDS_ROLE = PROTOCOL_ROLE_CURATOR;
const BADGE_TRACK_CURATOR_HOUSE_ODDS_THRESHOLDS = ["1", "3", "5", "10"] as string[];
const BADGE_TRACK_CURATOR_HOUSE_ODDS_DESCRIPTIONS = ["description1", "description2", "description3", "description4"] as string[];

export const BADGE_TRACK_CURATOR_PLANET_OF_THE_APED = "Number of subgraphs curated on within 100 blocks of publishing";
const BADGE_TRACK_CURATOR_PLANET_OF_THE_APED_ROLE = PROTOCOL_ROLE_CURATOR;
const BADGE_TRACK_CURATOR_PLANET_OF_THE_APED_THRESHOLDS = ["1", "5", "20"] as string[];
const BADGE_TRACK_CURATOR_PLANET_OF_THE_APED_DESCRIPTIONS = ["description1", "description2", "description3"] as string[];


/////////// DEVELOPER BADGE TRACKS //////////////

export const BADGE_TRACK_DEVELOPER_SIGNAL = "Signal from Subgraphs";
const BADGE_TRACK_DEVELOPER_SIGNAL_ROLE = PROTOCOL_ROLE_SUBGRAPH_DEVELOPER;
const BADGE_TRACK_DEVELOPER_SIGNAL_THRESHOLDS = ["10000000000000000000000", "50000000000000000000000", "150000000000000000000000", "500000000000000000000000"] as string[];
const BADGE_TRACK_DEVELOPER_SIGNAL_DESCRIPTIONS = ["description1", "description2", "description3", "description4"] as string[];

export const BADGE_TRACK_DEVELOPER_SUBGRAPHS = "Subgraph Deployment";
const BADGE_TRACK_DEVELOPER_SUBGRAPHS_ROLE = PROTOCOL_ROLE_SUBGRAPH_DEVELOPER;
const BADGE_TRACK_DEVELOPER_SUBGRAPHS_THRESHOLDS = ["1", "5", "20"] as string[];
const BADGE_TRACK_DEVELOPER_SUBGRAPHS_DESCRIPTIONS = ["description1", "description2", "description3"] as string[];




export const BADGE_TRACK_LEVEL_NAMES = ["Journeyman", "Adept", "Expert", "Legend"] as string[];


export class BadgeTrackConfig {
  name: string;
  role: string;
  thresholds: string[];
  descriptions: string[];

  constructor(name: string, role: string, thresholds: string[], descriptions: string[]) {
    this.name = name;
    this.role = role;
    this.thresholds = thresholds;
    this.descriptions = descriptions;
  }
}

let badgeTracks = new Map<string, BadgeTrackConfig>();
badgeTracks.set(
  BADGE_TRACK_INDEXER_SUBGRAPHS, 
  new BadgeTrackConfig(
    BADGE_TRACK_INDEXER_SUBGRAPHS, 
    BADGE_TRACK_INDEXER_SUBGRAPHS_ROLE, 
    BADGE_TRACK_INDEXER_SUBGRAPHS_THRESHOLDS, 
    BADGE_TRACK_INDEXER_SUBGRAPHS_DESCRIPTIONS
  )
);
badgeTracks.set(
  BADGE_TRACK_INDEXER_DISTRIBUTING,
  new BadgeTrackConfig(
    BADGE_TRACK_INDEXER_DISTRIBUTING, 
    BADGE_TRACK_INDEXER_DISTRIBUTING_ROLE, 
    BADGE_TRACK_INDEXER_DISTRIBUTING_THRESHOLDS, 
    BADGE_TRACK_INDEXER_DISTRIBUTING_DESCRIPTIONS
  )
);
badgeTracks.set(
  BADGE_TRACK_DELEGATOR_INDEXERS,
  new BadgeTrackConfig(
    BADGE_TRACK_DELEGATOR_INDEXERS,
    BADGE_TRACK_DELEGATOR_INDEXERS_ROLE,
    BADGE_TRACK_DELEGATOR_INDEXERS_THRESHOLDS,
    BADGE_TRACK_DELEGATOR_INDEXERS_DESCRIPTIONS
  )
);
badgeTracks.set(
  BADGE_TRACK_CURATOR_SUBGRAPHS,
  new BadgeTrackConfig(
    BADGE_TRACK_CURATOR_SUBGRAPHS,
    BADGE_TRACK_CURATOR_SUBGRAPHS_ROLE,
    BADGE_TRACK_CURATOR_SUBGRAPHS_THRESHOLDS,
    BADGE_TRACK_CURATOR_SUBGRAPHS_DESCRIPTIONS
  )
);
badgeTracks.set(
  BADGE_TRACK_DEVELOPER_SIGNAL,
  new BadgeTrackConfig(
    BADGE_TRACK_DEVELOPER_SIGNAL,
    BADGE_TRACK_DEVELOPER_SIGNAL_ROLE,
    BADGE_TRACK_DEVELOPER_SIGNAL_THRESHOLDS,
    BADGE_TRACK_DEVELOPER_SIGNAL_DESCRIPTIONS
  )
);
badgeTracks.set(
  BADGE_TRACK_INDEXER_QUERY_FEE,
  new BadgeTrackConfig(
    BADGE_TRACK_INDEXER_QUERY_FEE,
    BADGE_TRACK_INDEXER_QUERY_FEE_ROLE,
    BADGE_TRACK_INDEXER_QUERY_FEE_THRESHOLDS,
    BADGE_TRACK_INDEXER_QUERY_FEE_DESCRIPTIONS
  )
);
badgeTracks.set(
  BADGE_TRACK_INDEXER_ALLOCATIONS_OPENED,
  new BadgeTrackConfig(
    BADGE_TRACK_INDEXER_ALLOCATIONS_OPENED,
    BADGE_TRACK_INDEXER_ALLOCATIONS_OPENED_ROLE,
    BADGE_TRACK_INDEXER_ALLOCATIONS_OPENED_THRESHOLDS,
    BADGE_TRACK_INDEXER_ALLOCATIONS_OPENED_DESCRIPTIONS
  )
);
badgeTracks.set(
  BADGE_TRACK_DEVELOPER_SUBGRAPHS,
  new BadgeTrackConfig(
    BADGE_TRACK_DEVELOPER_SUBGRAPHS,
    BADGE_TRACK_DEVELOPER_SUBGRAPHS_ROLE,
    BADGE_TRACK_DEVELOPER_SUBGRAPHS_THRESHOLDS,
    BADGE_TRACK_DEVELOPER_SUBGRAPHS_DESCRIPTIONS
  )
);
badgeTracks.set(
  BADGE_TRACK_INDEXER_DELEGATOR_COUNT,
  new BadgeTrackConfig(
    BADGE_TRACK_INDEXER_DELEGATOR_COUNT,
    BADGE_TRACK_INDEXER_DELEGATOR_COUNT_ROLE,
    BADGE_TRACK_INDEXER_DELEGATOR_COUNT_THRESHOLDS,
    BADGE_TRACK_INDEXER_DELEGATOR_COUNT_DESCRIPTIONS
  )
);
badgeTracks.set(
  BADGE_TRACK_CURATOR_HOUSE_ODDS,
  new BadgeTrackConfig(
    BADGE_TRACK_CURATOR_HOUSE_ODDS,
    BADGE_TRACK_CURATOR_HOUSE_ODDS_ROLE,
    BADGE_TRACK_CURATOR_HOUSE_ODDS_THRESHOLDS,
    BADGE_TRACK_CURATOR_HOUSE_ODDS_DESCRIPTIONS
  )
);
badgeTracks.set(
  BADGE_TRACK_CURATOR_PLANET_OF_THE_APED,
  new BadgeTrackConfig(
    BADGE_TRACK_CURATOR_PLANET_OF_THE_APED,
    BADGE_TRACK_CURATOR_PLANET_OF_THE_APED_ROLE,
    BADGE_TRACK_CURATOR_PLANET_OF_THE_APED_THRESHOLDS,
    BADGE_TRACK_CURATOR_PLANET_OF_THE_APED_DESCRIPTIONS
  )
);

export function getBadgeTrackConfig(name: string): BadgeTrackConfig {
  return badgeTracks.get(name);
}