import { Bookmark } from "server/models";

export type Msg =
  | ["bookmarks/load", {}]
  | ["bookmarks/set", { list: Bookmark[] }];
