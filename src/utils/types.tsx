
export interface Commit {
  id: string;
  datetime: string;
  habitId: string;
}
export interface Habit {
  id: string;
  name: string;
  archived:boolean
}
export interface DayData {
  datetime?: string;
  commits?: Commit[];
  currentHabits?: string[]
}
export interface DayDataMap {
  [date: string]: DayData
}
export interface CommitHistory {
  history: DayDataMap,
  datetime: string;
}
