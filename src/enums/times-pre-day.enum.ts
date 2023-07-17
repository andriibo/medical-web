export enum TimesPreDay {
  QD = '1 (QD)',
  BID = '2 (BID)',
  TID = '3 (TID)',
  QID = '4 (QID)',
}

export type TimesPreDayKeys = keyof typeof TimesPreDay
