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
        .then(r => r.json())
        .then(list => apply(m => ({ ...m, bookmarks: list })))
        .catch(err => console.error("load bookmarks:", err));
      break;

    case "groups/load":
      apiFetch("/api/groups", { headers: Auth.headers(user) })
        .then(r => r.json())
        .then(list => apply(m => ({ ...m, groups: list })))
        .catch(err => console.error("load groups:", err));
      break;

    case "bookmark/save":
      apiFetch(`/api/bookmarks/${msg[1].id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...Auth.headers(user)
        },
        body: JSON.stringify(msg[1].bookmark)
      })
        .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
        .then(saved =>
          apply(m => ({
            ...m,
            bookmarks: m.bookmarks?.map(b => b.id === saved.id ? saved : b)
          }))
        )
        .then(() => msg[1].onSuccess?.())
        .catch(err => msg[1].onFailure?.(err));
      break;

    default:
      const unhandled: never = msg[0];
      throw new Error(`Unhandled message "${unhandled}"`);
  }
}
