import {
  User,
  Progress,
  MetricConsumer,
  BadgeDefinition,
} from "../../generated/schema";
import { zeroBI } from "../helpers/constants";
import { log, BigInt } from "@graphprotocol/graph-ts";
import {
  BadgeAwardEventData,
  createBadgeAward,
  createOrLoadUser,
} from "./emblemModels";

export function incrementProgress(
  user: string,
  metric: string,
  eventData: BadgeAwardEventData
): void {
  let progress = _createOrLoadProgress(user, metric);
  updateProgress(progress, progress.value.plus(BigInt.fromI32(1)), eventData);
}

export function addToProgress(
  user: string,
  metric: string,
  value: BigInt,
  eventData: BadgeAwardEventData
): void {
  let progress = _createOrLoadProgress(user, metric);
  updateProgress(progress, progress.value.plus(value), eventData);
}

export function subtractFromProgress(
  user: string,
  metric: string,
  value: BigInt,
  eventData: BadgeAwardEventData
): void {
  let progress = _createOrLoadProgress(user, metric);
  updateProgress(progress, progress.value.minus(value), eventData);
}

function updateProgress(
  progress: Progress,
  updatedValue: BigInt,
  eventData: BadgeAwardEventData
): void {
  if (updatedValue.gt(progress.value)) {
    // iterate through BadgeDefinitions tracking this metric
    let badgeDefinitions = _badgeDefinitionsForMetric(progress.metric);
    for (let i = 0; i < badgeDefinitions.length; i++) {
      let badgeDefinition = BadgeDefinition.load(
        badgeDefinitions[i]
      ) as BadgeDefinition;
      _awardBadgeIfNeeded(
        badgeDefinition,
        progress.value,
        updatedValue,
        createOrLoadUser(progress.user),
        eventData
      );
    }

    progress.value = updatedValue;
    progress.save();
  }
}

function _createOrLoadProgress(user: string, metric: string): Progress {
  let id = user.concat("-").concat(metric);
  let progress = Progress.load(id);

  if (progress == null) {
    progress = new Progress(id);
    progress.metric = metric;
    progress.user = user;
    progress.value = zeroBI();
    progress.save();
  }

  return progress as Progress;
}

// returns an array of BadgeDefinitionIds tracking a given metric
function _badgeDefinitionsForMetric(metric: string): string[] {
  let metricConsumer = MetricConsumer.load(metric);
  if (metricConsumer == null) {
    metricConsumer = new MetricConsumer(metric);
    metricConsumer.badgeDefinitions = [];
    metricConsumer.save();
  }

  return metricConsumer.badgeDefinitions;
}

function _awardBadgeIfNeeded(
  badgeDefinition: BadgeDefinition,
  oldValue: BigInt,
  updatedValue: BigInt,
  user: User,
  eventData: BadgeAwardEventData
): void {
  if (
    oldValue.lt(badgeDefinition.threshold) &&
    updatedValue.ge(badgeDefinition.threshold)
  ) {
    createBadgeAward(badgeDefinition, user, eventData);
  }
}
