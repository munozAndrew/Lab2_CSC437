import { Bookmark, Group } from "server/models";

export type Msg =
  | ["bookmarks/load", {}]
  | ["bookmarks/set", { list: Bookmark[] }]

  | ["groups/load", {}]
  | ["groups/set", { list: Group[] }];
