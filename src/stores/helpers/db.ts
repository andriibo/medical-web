import Dexie, { Table } from 'dexie'

import { IThresholds } from '~models/threshold.model'
import { IVitalDb } from '~models/vital.model'

export class MySubClassedDexie extends Dexie {
  vitals!: Table<IVitalDb>

  thresholds!: Table<IThresholds>

  constructor() {
    super('zenzersDb')
    this.version(1).stores({
      vitals: 'id, items',
      thresholds:
        'thresholdsId, minHr, maxHr, hrSetBy, hrSetAt, minTemp, maxTemp, tempSetBy, tempSetAt, minSpo2, spo2SetBy,' +
        'spo2SetAt, minRr, maxRr, rrSetBy, rrSetAt, minDbp, maxDbp, dbpSetBy, dbpSetAt, minSbp, maxSbp,' +
        'sbpSetBy, sbpSetAt, minMap, maxMap, mapSetBy, mapSetAt, isPending, createdAt',
    })
  }
}

export const db = new MySubClassedDexie()
