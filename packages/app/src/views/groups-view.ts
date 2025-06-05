// packages/app/src/views/groups-view.ts
import { css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { View } from "@calpoly/mustang";
import { Model } from "../model";
import { Msg } from "../messages";
import "../components/group-card";
import "../components/group-form";

@customElement("groups-view")
export class GroupsViewElement extends View<Model, Msg> {
  constructor() { super("tabsaver:model"); }

  /* reactive getter */
  @state()
  get list() { return this.model.groups ?? []; }

  connectedCallback() {
    super.connectedCallback();

    /* load once if not in store */
    if (!this.model.groups) {
      this.dispatchMessage(["groups/load", {}]);
    }

    /* after a new group is created, refresh the list */
    this.addEventListener("group:created",
      () => this.dispatchMessage(["groups/load", {}]));
  }

  static styles = css`
    :host { display:block; padding:1rem; }
    main { display:grid; gap:1rem; }
    h2   { margin-top:0; }
  `;

  render() {
    return html`
      <h2>Your groups</h2>

      ${this.list.length
        ? html`
            <main>
              ${this.list.map(g => html`<group-card .group=${g}></group-card>`)}
            </main>`
        : html`<p>Loading…</p>`}

      <h3>Create new group</h3>
      <group-form></group-form>
    `;
  }
}
