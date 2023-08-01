import {Dayjs} from "dayjs";

export type LogItem = {
  [key: string]: string;
  id: string;
  route: string;
  grade: string;
  date: string;
  crag: string;
}

export interface ArticleType {
  title: string;
  summary: string;
  url: string;
  keywords: string[];
}

export interface SavedArticleType extends ArticleType {
  itemId: string;
}

export interface ArticleFilterParamsType {
  startDate:  Dayjs | null;
  endDate:  Dayjs | null;
  keyword:  string | null;
}

export type TodoCragType = {
  name: string;
  geoCoordinates: string;
  conditions: string;
}

export type NotesByLogItemKeyType = Record<string, { id: string, notes: string }>

export interface LogItemNotesType {
  logItemId: string;
  notes: string;
}

export interface SavedLogItemNotesType extends LogItemNotesType {
  id: string;
}

export interface SavedTodoCragType extends TodoCragType {
  id: string;
}