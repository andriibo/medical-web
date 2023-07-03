import {
  AllVitalsHistoryUseCaseFactory,
  HistoryItem,
  SelectedVitalHistoryUseCaseFactory,
  VitalsItemMapper,
} from '@abnk/medical-support/src/history-vitals'

import { VitalsTypeFilterKeys } from '~/enums/vital-type.enum'
import { sortInSpecificOrder } from '~helpers/sort-in-specific-order'
import { IThresholds } from '~models/threshold.model'
import { IVital, IVitalsHistoryItem } from '~models/vital.model'

const mapper = new VitalsItemMapper()
const useCase = SelectedVitalHistoryUseCaseFactory.createWithDefaultOptions()
const useAllCase = AllVitalsHistoryUseCaseFactory.createWithDefaultOptions()

const historyItemAdapter = (historyItem: HistoryItem, thresholds: IThresholds[]): IVitalsHistoryItem => {
  const currentThresholds = thresholds.find((item) => item.thresholdsId === historyItem.getThresholdsId())

  const historyVitalsMetadata = historyItem.getHistoryVitalsMetadata().map((item) => ({
    historyVitalMetadataDto: {
      abnormalMaxValue: item.getAbnormalMaxValue(),
      abnormalMinValue: item.getAbnormalMinValue(),
      isNormal: item.isNormal(),
      totalMean: item.getTotalMean(),
    },
    name: item.getName(),
  }))

  const sortedHistoryVitalsMetadata = sortInSpecificOrder(historyVitalsMetadata, 'name', ['hr', 'temp', 'spo2', 'rr'])

  return {
    endTimestamp: historyItem.getEndTimestamp(),
    startTimestamp: historyItem.getStartTimestamp(),
    historyVitalsMetadata: sortedHistoryVitalsMetadata,
    thresholdsId: historyItem.getThresholdsId(),
    thresholds: currentThresholds || null,
  }
}

interface HistoryItemsMapperProps {
  vitals: IVital[]
  vitalType: VitalsTypeFilterKeys
  thresholds: IThresholds[]
}

export const vitalsItemMapper = ({ vitals }: { vitals: IVital[] }) => vitals.map((vital) => mapper.map(vital))

export const historyItemsMapper = ({
  vitals,
  vitalType,
  thresholds,
}: HistoryItemsMapperProps): IVitalsHistoryItem[] => {
  const items = vitals.map((vital) => mapper.map(vital))

  // console.log(vitals)
  // console.log(items)

  const historyItems = vitalType === 'all' ? useAllCase.createHistory(items) : useCase.createHistory(items, vitalType)

  return historyItems.map((historyItem) => historyItemAdapter(historyItem, thresholds))
}
