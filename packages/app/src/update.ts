import { Auth, Update } from "@calpoly/mustang";
import { apiFetch } from "./utils/api";
import { Msg } from "./messages";
import { Model } from "./model";

export default function update(
  msg: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (msg[0]) {

    case "bookmarks/load":
      apiFetch("/api/bookmarks", { headers: Auth.headers(user) })
        .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
        .then(list =>
          apply(m => ({ ...m, bookmarks: list }))
        )
        .catch(err => console.error("load bookmarks:", err));
      break;

    default:
      console.warn("Unhandled message", msg[0]);
  }
}
