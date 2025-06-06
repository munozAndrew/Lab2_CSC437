// packages/app/src/main.ts
import {
  Auth,
  History,
  Switch,
  Store,
  Form,
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
import { BookmarkEditElement } from "./views/bookmarks-edit";
import { AboutViewElement } from "./views/about-view";

const routes = [

  { path: "/app/bookmarks/:id/edit", protected: true,
  view: p => html`<bookmark-edit id=${p.id}></bookmark-edit>` },
  
  { path: "/app/groups", protected: true,
    view: () => html`<groups-view></groups-view>` },

  { path: "/app/bookmarks", protected: true,
    view: () => html`<bookmarks-view></bookmarks-view>` },
  { path: "/app/about",
      view: () => html`<about-view></about-view>` },
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
  "mu-form":    Form.Element,
  "bookmarks-view":   BookmarksViewElement,
  "bookmark-edit": BookmarkEditElement,

  "groups-view":      GroupsViewElement,
  "about-view":     AboutViewElement
});
