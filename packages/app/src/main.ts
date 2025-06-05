import { define, Auth, History, Switch } from "@calpoly/mustang";
import { html } from "lit";

import { HeaderElement }    from "./components/ts-header";
import { HomeViewElement }  from "./views/home-view";
import { BookmarksViewElement } from "./views/bookmarks-view";
import { GroupsViewElement } from "./views/groups-view";

//import { AboutViewElement } from "./views/about-view";

const routes = [
//  {
//    path: "/app/about",
//    view: () => html`<about-view></about-view>`
//  },
  { path: "/app/groups", protected: true,
    view: () => html`<groups-view></groups-view>` },
    
  { path: "/app/bookmarks", protected: true,
    view: () => html`<bookmarks-view></bookmarks-view>` },
  {
    path: "/app",
    view: () => html`<home-view></home-view>`
  },
  { path: "/", redirect: "/app" }
];

class AppSwitch extends Switch.Element {
  constructor() {
    super(routes, "tabsaver:history", "tabsaver:auth");
  }
}

define({
  "mu-auth":    Auth.Provider,
  "mu-history": History.Provider,
  "mu-switch":  AppSwitch,
  "ts-header":  HeaderElement,
  "home-view":  HomeViewElement,
  "groups-view": GroupsViewElement,
  "bookmarks-view": BookmarksViewElement
  //"about-view": AboutViewElement
});
