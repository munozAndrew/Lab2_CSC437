import { Bookmark, Group } from "server/models";

export interface Model {
  bookmarks?: Bookmark[]; 
  bookmark?: Bookmark;
  groups?: Group[];
}

export const init: Model = {};
