import {
  Progress,
  MetricConsumer,
  BadgeDefinition,
} from "../../generated/schema";
import { zeroBI } from "../helpers/constants";
import { log, BigInt } from "@graphprotocol/graph-ts";
import { EarnedBadgeEventData, createEarnedBadge } from "./emblemModels";

export function incrementProgress(
  badgeUser: string,
  metric: string,
  eventData: EarnedBadgeEventData
): void {
  let progress = _createOrLoadProgress(badgeUser, metric);
  updateProgress(progress, progress.value.plus(BigInt.fromI32(1)), eventData);
}

export function addToProgress(
  badgeUser: string,
  metric: string,
  value: BigInt,
  eventData: EarnedBadgeEventData
): void {
  let progress = _createOrLoadProgress(badgeUser, metric);
  updateProgress(progress, progress.value.plus(value), eventData);
}

export function subtractFromProgress(
  badgeUser: string,
  metric: string,
  value: BigInt,
  eventData: EarnedBadgeEventData
): void {
  let progress = _createOrLoadProgress(badgeUser, metric);
  updateProgress(progress, progress.value.minus(value), eventData);
}

function updateProgress(
  progress: Progress,
  updatedValue: BigInt,
  eventData: EarnedBadgeEventData
): void {
  if (updatedValue.gt(progress.value)) {
    // iterate through BadgeDefinitions tracking this metric
    let badgeDefinitions = _badgeDefinitionsForMetric(progress.metric);
    for (let i = 0; i < badgeDefinitions.length; i++) {
      let badgeDefinition = changetype<BadgeDefinition>(
        BadgeDefinition.load(badgeDefinitions[i])
      );

      if (updatedValue.ge(badgeDefinition.threshold)) {
        createEarnedBadge(badgeDefinition, progress.badgeUser, eventData);
      }
    }

    progress.value = updatedValue;
    progress.save();
  }
}

function _createOrLoadProgress(badgeUser: string, metric: string): Progress {
  let id = badgeUser.concat("-").concat(metric);
  let progress = Progress.load(id);

  if (progress == null) {
    progress = new Progress(id);
    progress.metric = metric;
    progress.badgeUser = badgeUser;
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
