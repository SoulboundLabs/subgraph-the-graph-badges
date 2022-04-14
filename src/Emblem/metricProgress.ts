import { BigInt } from "@graphprotocol/graph-ts";
import {
  SoulboundBadgeDefinition,
  SoulboundMetricConsumer,
  SoulboundUserStat,
} from "../../generated/schema";
import { zeroBI } from "../helpers/constants";
import { createSoulboundBadge, SoulboundBadgeEventData } from "./emblemModels";

export function incrementProgress(
  soulboundUser: string,
  metricId: i32,
  eventData: SoulboundBadgeEventData
): void {
  let progress = _createOrLoadProgress(soulboundUser, metricId);
  updateProgress(progress, progress.value.plus(BigInt.fromI32(1)), eventData);
}

export function addToProgress(
  soulboundUser: string,
  metricId: i32,
  value: BigInt,
  eventData: SoulboundBadgeEventData
): void {
  let progress = _createOrLoadProgress(soulboundUser, metricId);
  updateProgress(progress, progress.value.plus(value), eventData);
}

export function subtractFromProgress(
  soulboundUser: string,
  metricId: i32,
  value: BigInt,
  eventData: SoulboundBadgeEventData
): void {
  let progress = _createOrLoadProgress(soulboundUser, metricId);
  updateProgress(progress, progress.value.minus(value), eventData);
}

function updateProgress(
  progress: SoulboundUserStat,
  updatedValue: BigInt,
  eventData: SoulboundBadgeEventData
): void {
  if (updatedValue.gt(progress.value)) {
    // iterate through SoulboundBadgeDefinitions tracking this metric
    let soulboundBadgeDefinitions = _soulboundBadgeDefinitionsForMetric(
      progress.metric
    );
    for (let i = 0; i < soulboundBadgeDefinitions.length; i++) {
      let soulboundBadgeDefinition = changetype<SoulboundBadgeDefinition>(
        SoulboundBadgeDefinition.load(soulboundBadgeDefinitions[i])
      );

      if (updatedValue.ge(soulboundBadgeDefinition.threshold)) {
        createSoulboundBadge(
          soulboundBadgeDefinition,
          progress.soulboundUser,
          eventData
        );
      }
    }

    progress.value = updatedValue;
    progress.save();
  }
}

function _createOrLoadProgress(
  soulboundUser: string,
  metric: i32
): SoulboundUserStat {
  let id = soulboundUser.concat("-").concat(BigInt.fromI32(metric).toString());
  let progress = SoulboundUserStat.load(id);

  if (progress == null) {
    progress = new SoulboundUserStat(id);
    progress.soulboundUser = soulboundUser;
    progress.metric = BigInt.fromI32(metric).toString();
    progress.value = zeroBI();
    progress.valueOnChain = zeroBI();
    progress.maxValue = zeroBI();
    progress.maxValueBlockNumber = zeroBI();
    progress.save();
  }

  return progress as SoulboundUserStat;
}

// returns an array of SoulboundBadgeDefinitionIds tracking a given metric
function _soulboundBadgeDefinitionsForMetric(metric: string): string[] {
  let soulboundMetricConsumer = SoulboundMetricConsumer.load(metric);
  if (soulboundMetricConsumer == null) {
    soulboundMetricConsumer = new SoulboundMetricConsumer(metric);
    soulboundMetricConsumer.soulboundBadgeDefinitions = [];
    soulboundMetricConsumer.save();
  }

  return soulboundMetricConsumer.soulboundBadgeDefinitions;
}
