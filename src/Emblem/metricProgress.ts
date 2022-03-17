import { BigInt } from "@graphprotocol/graph-ts";
import {
  BadgeDefinition,
  MetricConsumer,
  EmblemUserLiveData,
} from "../../generated/schema";
import { zeroBI } from "../helpers/constants";
import { createEarnedBadge, EarnedBadgeEventData } from "./emblemModels";

export function incrementProgress(
  emblemUser: string,
  metricId: i32,
  eventData: EarnedBadgeEventData
): void {
  let progress = _createOrLoadProgress(emblemUser, metricId);
  updateProgress(progress, progress.value.plus(BigInt.fromI32(1)), eventData);
}

export function addToProgress(
  emblemUser: string,
  metricId: i32,
  value: BigInt,
  eventData: EarnedBadgeEventData
): void {
  let progress = _createOrLoadProgress(emblemUser, metricId);
  updateProgress(progress, progress.value.plus(value), eventData);
}

export function subtractFromProgress(
  emblemUser: string,
  metricId: i32,
  value: BigInt,
  eventData: EarnedBadgeEventData
): void {
  let progress = _createOrLoadProgress(emblemUser, metricId);
  updateProgress(progress, progress.value.minus(value), eventData);
}

function updateProgress(
  progress: EmblemUserLiveData,
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
        createEarnedBadge(badgeDefinition, progress.emblemUser, eventData);
      }
    }

    progress.value = updatedValue;
    progress.save();
  }
}

function _createOrLoadProgress(
  emblemUser: string,
  metric: i32
): EmblemUserLiveData {
  let id = emblemUser.concat("-").concat(BigInt.fromI32(metric).toString());
  let progress = EmblemUserLiveData.load(id);

  if (progress == null) {
    progress = new EmblemUserLiveData(id);
    progress.emblemUser = emblemUser;
    progress.metric = BigInt.fromI32(metric).toString();
    progress.value = zeroBI();
    progress.valueOnChain = zeroBI();
    progress.maxValue = zeroBI();
    progress.maxValueBlockNumber = zeroBI();
    progress.save();
  }

  return progress as EmblemUserLiveData;
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
