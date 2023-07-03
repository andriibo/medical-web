import Dexie, { Table } from 'dexie'

import { IThresholds } from '~models/threshold.model'
import { IVital } from '~models/vital.model'

export class MySubClassedDexie extends Dexie {
  vitals!: Table<IVital>

  thresholds!: Table<IThresholds>

  constructor() {
    super('zenzersDb')
    this.version(1).stores({
      vitals:
        'vitalId, temp, isTempNormal, hr, isHrNormal, spo2, isSpo2Normal, rr, isRrNormal, ' +
        'fall, timestamp, thresholdsId',
      thresholds:
        'thresholdsId, minHr, maxHr, hrSetBy, hrSetAt, minTemp, maxTemp, tempSetBy, tempSetAt, minSpo2, spo2SetBy,' +
        'spo2SetAt, minRr, maxRr, rrSetBy, rrSetAt, minDbp, maxDbp, dbpSetBy, dbpSetAt, minSbp, maxSbp,' +
        'sbpSetBy, sbpSetAt, minMap, maxMap, mapSetBy, mapSetAt, isPending, createdAt',
    })
  }
}

export const db = new MySubClassedDexie()
