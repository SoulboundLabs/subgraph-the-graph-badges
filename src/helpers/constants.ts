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

export const PROTOCOL_ROLE_INDEXER = "Indexer";
export const PROTOCOL_ROLE_DELEGATOR = "Delegator";
export const PROTOCOL_ROLE_CURATOR = "Curator";
export const PROTOCOL_ROLE_SUBGRAPH_DEVELOPER = "Subgraph Developer";

export const AWARDED_AT_TYPE_BLOCK = "Block";
export const AWARDED_AT_TYPE_ERA = "Era";

export const PROTOCOL_NAME_THE_GRAPH = "The Graph";

export const BADGE_ARTIST_FIRST_TO_CLOSE = "Vadim11";
export const BADGE_NAME_FIRST_TO_CLOSE = "First To Close";
export const BADGE_DESCRIPTION_FIRST_TO_CLOSE =
  "Awarded to indexers who are first to close an allocation for a subgraph";
export const BADGE_VOTE_POWER_FIRST_TO_CLOSE = 1;

export const BADGE_ARTIST_28_EPOCHS_LATER = "Lyds";
export const BADGE_NAME_28_EPOCHS_LATER = "28 Epochs Later";
export const BADGE_DESCRIPTION_28_EPOCHS_LATER =
  "Awarded to indexers who close an allocation in under 28 epochs 28 times";
export const BADGE_VOTE_POWER_28_EPOCHS_LATER = 1;
export const BADGE_STREAK_MIN_CLOSES_28_EPOCHS_LATER = 28;

export const BADGE_ARTIST_NEVER_SLASHED = "cm-graphtronauts";
export const BADGE_NAME_NEVER_SLASHED = "Never Slashed";
export const BADGE_DESCRIPTION_NEVER_SLASHED =
  "Awarded to indexers who don't get slashed for at least 30 days";
export const BADGE_VOTE_POWER_NEVER_SLASHED = 1;
export const BADGE_STREAK_MIN_DAYS_NEVER_SLASHED = 30;

export const BADGE_ARTIST_DELEGATION_NATION = "r00tboy";
export const BADGE_NAME_DELEGATION_NATION = "Delegation Nation";
export const BADGE_DESCRIPTION_DELEGATION_NATION =
  "Awarded to delegators who delegate to 5 or more indexers";
export const BADGE_VOTE_POWER_DELEGATION_NATION = 1;
export const BADGE_MIN_DAYS_DELEGATION_NATION = 5;

export const BADGE_ARTIST_DELEGATION_STREAK = "Lyds";
export const BADGE_NAME_DELEGATION_STREAK = "Delegation Streak";
export const BADGE_DESCRIPTION_DELEGATION_STREAK =
  "Awarded to delegators who delegate for at least 90 consecutive days";
export const BADGE_VOTE_POWER_DELEGATION_STREAK = 1;
export const BADGE_STREAK_MIN_DAYS_DELEGATION_STREAK = 90;

export const BADGE_ARTIST_PLANET_OF_THE_APED = "Lyds";
export const BADGE_NAME_PLANET_OF_THE_APED = "Planet Of The Aped";
export const BADGE_DESCRIPTION_PLANET_OF_THE_APED =
  "Awarded to curators who signal within 420 blocks of a subgraph being published";
export const BADGE_VOTE_POWER_PLANET_OF_THE_APED = 1;

export const BADGE_ARTIST_SUBGRAPH_SHARK = "Vadim11";
export const BADGE_NAME_SUBGRAPH_SHARK = "Subgraph Shark";
export const BADGE_DESCRIPTION_SUBGRAPH_SHARK =
  "Awarded to curators who sell curation shares for a profit";
export const BADGE_VOTE_POWER_SUBGRAPH_SHARK = 1;

export const BADGE_ARTIST_SUBGRAPH_DEVELOPER = "Lyds";
export const BADGE_NAME_SUBGRAPH_DEVELOPER = "Captain Subgraph";
export const BADGE_DESCRIPTION_SUBGRAPH_DEVELOPER =
  "Awarded to developers who publish their first subgraph";
export const BADGE_VOTE_POWER_SUBGRAPH_DEVELOPER = 1;

export const BADGE_ARTIST_CURATOR_TRIBE = "Lyds";
export const BADGE_NAME_CURATOR_TRIBE = "Curator Tribe";
export const BADGE_DESCRIPTION_CURATOR_TRIBE = "Awarded to first-time curators";
export const BADGE_VOTE_POWER_CURATOR_TRIBE = 1;

export const BADGE_ARTIST_DELEGATION_TRIBE = "felixwillneverdie";
export const BADGE_NAME_DELEGATION_TRIBE = "Delegation Tribe";
export const BADGE_DESCRIPTION_DELEGATION_TRIBE =
  "Awarded to first-time delegators";
export const BADGE_VOTE_POWER_DELEGATION_TRIBE = 1;

export const BADGE_ARTIST_INDEXER_TRIBE = "Jestinsane";
export const BADGE_NAME_INDEXER_TRIBE = "Indexer Tribe";
export const BADGE_DESCRIPTION_INDEXER_TRIBE =
  "Awarded to first-time indexters";
export const BADGE_VOTE_POWER_INDEXER_TRIBE = 1;


export const BADGE_TRACK_INDEXING = "Indexing";
const BADGE_TRACK_INDEXING_ROLE = PROTOCOL_ROLE_INDEXER;
const BADGE_TRACK_INDEXING_THRESHOLDS = ["1","5","15","50"] as string[];
const BADGE_TRACK_INDEXING_DESCRIPTIONS = ["description1", "description2", "description3", "description4"] as string[];


export const BADGE_TRACK_YIELD = "Yield";
const BADGE_TRACK_YIELD_ROLE = PROTOCOL_ROLE_INDEXER;
const BADGE_TRACK_YIELD_THRESHOLDS = ["10000","100000","1000000","10000000"] as string[];
const BADGE_TRACK_YIELD_DESCRIPTIONS = ["description1", "description2", "description3", "description4"] as string[];

export const BADGE_TRACK_DELEGATING = "Delegating";
const BADGE_TRACK_DELEGATING_ROLE = PROTOCOL_ROLE_DELEGATOR;
const BADGE_TRACK_DELEGATING_THRESHOLDS = ["1", "3", "10", "25"] as string[];
const BADGE_TRACK_DELEGATING_DESCRIPTIONS = ["description1", "description2", "description3", "description4"] as string[];

export const BADGE_TRACK_CURATING = "Curating";
const BADGE_TRACK_CURATING_ROLE = PROTOCOL_ROLE_CURATOR;
const BADGE_TRACK_CURATING_THRESHOLDS = ["1", "5", "15", "50"] as string[];
const BADGE_TRACK_CURATING_DESCRIPTIONS = ["description1", "description2", "description3", "description4"] as string[];

export const BADGE_TRACK_DEVELOPER = "Signal";
const BADGE_TRACK_DEVELOPER_ROLE = PROTOCOL_ROLE_SUBGRAPH_DEVELOPER;
const BADGE_TRACK_DEVELOPER_THRESHOLDS = ["10000", "50000", "150000", "500000"] as string[];
const BADGE_TRACK_DEVELOPER_DESCRIPTIONS = ["description1", "description2", "description3", "description4"] as string[];

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
  BADGE_TRACK_INDEXING, 
  new BadgeTrackConfig(
    BADGE_TRACK_INDEXING, 
    BADGE_TRACK_INDEXING_ROLE, 
    BADGE_TRACK_INDEXING_THRESHOLDS, 
    BADGE_TRACK_INDEXING_DESCRIPTIONS
  )
);
badgeTracks.set(
  BADGE_TRACK_YIELD,
  new BadgeTrackConfig(
    BADGE_TRACK_YIELD, 
    BADGE_TRACK_YIELD_ROLE, 
    BADGE_TRACK_YIELD_THRESHOLDS, 
    BADGE_TRACK_YIELD_DESCRIPTIONS
  )
);
badgeTracks.set(
  BADGE_TRACK_DELEGATING,
  new BadgeTrackConfig(
    BADGE_TRACK_DELEGATING,
    BADGE_TRACK_DELEGATING_ROLE,
    BADGE_TRACK_DELEGATING_THRESHOLDS,
    BADGE_TRACK_DELEGATING_DESCRIPTIONS
  )
);
badgeTracks.set(
  BADGE_TRACK_CURATING,
  new BadgeTrackConfig(
    BADGE_TRACK_CURATING,
    BADGE_TRACK_CURATING_ROLE,
    BADGE_TRACK_CURATING_THRESHOLDS,
    BADGE_TRACK_CURATING_DESCRIPTIONS
  )
);
badgeTracks.set(
  BADGE_TRACK_DEVELOPER,
  new BadgeTrackConfig(
    BADGE_TRACK_DEVELOPER,
    BADGE_TRACK_DEVELOPER_ROLE,
    BADGE_TRACK_DEVELOPER_THRESHOLDS,
    BADGE_TRACK_DEVELOPER_DESCRIPTIONS
  )
);

export function getBadgeTrackConfig(name: string): BadgeTrackConfig {
  return badgeTracks.get(name);
}