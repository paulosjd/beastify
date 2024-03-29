import { Dayjs } from "dayjs";

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
  approachTime: string;
  driveTime: string;
  minTemp: string;
  maxTemp: string;
  geoCoordinates: string;
  conditions: string;
}

export type TodoClimbType = {
  name: string;
  cragId: string;
  grade: string;
  notes: string;
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

export interface SavedTodoClimbType extends TodoClimbType {
  id: string;
}

export interface UserType {
  displayName: string | null;
  userId: string;
  avatar?: string | null;
}

export interface RegistrationType {
  displayName: string;
  email: string;
  password: string;
}

export interface EditedArticleType {
  id: string;
  newTitle: string;
  newSummary: string;
  newUrl: string;
  newKeywords: string[];
}

export interface EditedCragType {
  id: string;
  name: string;
  newApproachTime: string;
  newDriveTime: string;
  newMinTemp: string;
  newMaxTemp: string;
  newGeocoordinates?: string;
  newConditions?: string;
}

export interface UserConfigType {
  id?: string;
  bodyWeightSheetId?: string;
  logbookSheetId?: string;
  pullupsSheetId?: string;
  mapCenterLat?: string;
  mapCenterLon?: string;
  mapZoom?: string;
}

export interface SavedUserConfigType extends UserConfigType {
  id: string;
}

export interface CragFilterOptions {
  approachTime?: string;
  driveTime?: string;
  temp: number;
}