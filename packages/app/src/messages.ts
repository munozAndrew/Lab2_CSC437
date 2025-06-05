import { Bookmark, Group } from "server/models";

export type Msg =
  | ["bookmarks/load", {}]
  | ["bookmarks/set", { list: Bookmark[] }]
  | [
      "bookmark/save",
      {
        id: string;
        bookmark: Bookmark;
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
  | ["groups/load", {}]
  | ["groups/set", { list: Group[] }];
