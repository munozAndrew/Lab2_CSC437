// packages/app/src/views/bookmarks-view.ts
import { css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { View } from "@calpoly/mustang";
import { Model } from "../model";
import { Msg } from "../messages";
import "../components/bookmark-form";

@customElement("bookmarks-view")
export class BookmarksViewElement extends View<Model, Msg> {
  constructor() { super("tabsaver:model"); }

  @state()
  get list() { return this.model.bookmarks ?? []; }

  connectedCallback() {
    super.connectedCallback();
    if (!this.model.bookmarks) {
      this.dispatchMessage(["bookmarks/load", {}]);
    }
    this.addEventListener("bookmark:created",
      () => this.dispatchMessage(["bookmarks/load", {}]));
  }

  static styles = css`
    :host { display:block; padding:1rem; }
    ul   { list-style:none; padding:0; }
    li   { padding:.5rem 0; border-bottom:1px solid #ccc; }
    a    { color:royalblue; text-decoration:none; }
    .edit { margin-left:.5rem; font-size:0.9em; }
  `;

  render() {
    return html`
      <h2>Your bookmarks</h2>

      ${this.list.length
        ? html`
            <ul>
              ${this.list.map(b => html`
                <li>
                  <a href=${b.url} target="_blank">${b.name}</a>
                  <a class="edit" href="/app/bookmarks/${b.id}/edit"
                     title="Edit bookmark">✎</a>
                  ${b.description
                    ? html`<small> – ${b.description}</small>` : null}
                </li>`)}
            </ul>`
        : html`<p>Loading…</p>`}

      <h3>Add new bookmark</h3>
      <bookmark-form></bookmark-form>
    `;
  }
}
