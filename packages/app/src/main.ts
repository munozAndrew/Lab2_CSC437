// packages/app/src/main.ts
import {
  Auth,
  History,
  Switch,
  Store,
  define
} from "@calpoly/mustang";
import { html } from "lit";

import { Model, init } from "./model";
import { Msg } from "./messages";
import update from "./update";

import { HeaderElement } from "./components/ts-header";
import { HomeViewElement } from "./views/home-view";
import { BookmarksViewElement } from "./views/bookmarks-view";
import { GroupsViewElement } from "./views/groups-view";

const routes = [
  { path: "/app/groups", protected: true,
    view: () => html`<groups-view></groups-view>` },

  { path: "/app/bookmarks", protected: true,
    view: () => html`<bookmarks-view></bookmarks-view>` },

  { path: "/app",
    view: () => html`<home-view></home-view>` },

  { path: "/", redirect: "/app" }
];

class AppSwitch extends Switch.Element {
  constructor() {
    super(routes, "tabsaver:history", "tabsaver:auth");
  }
}

class AppStore extends Store.Provider<Model, Msg> {
  constructor() {
    super(update, init, "tabsaver:auth");
  }
}

define({
  "mu-auth":    Auth.Provider,
  "mu-history": History.Provider,
  "mu-switch":  AppSwitch,
  "mu-store":   AppStore,
  "ts-header":  HeaderElement,
  "home-view":        HomeViewElement,
  "bookmarks-view":   BookmarksViewElement,
  "groups-view":      GroupsViewElement
  // "about-view":     AboutViewElement
});
