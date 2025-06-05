import { html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { View, History, Form } from "@calpoly/mustang";
import { Bookmark } from "server/models";
import { Model } from "../model";
import { Msg } from "../messages";

@customElement("bookmark-edit")
export class BookmarkEditElement extends View<Model, Msg> {
  static uses = { "mu-form": Form.Element };

  @property({ attribute: "id" }) id!: string;

  @state()
  get bm(): Bookmark | undefined {
    return this.model.bookmarks?.find(b => b.id === this.id);
  }

  constructor() { super("tabsaver:model"); }

  render() {
    return html`
      <main class="page">
        <h2>Edit bookmark</h2>
        <mu-form .init=${this.bm} @mu-form:submit=${this.handleSubmit}>
          <label>Name <input name="name" .value=${this.bm?.name ?? ""}></label>
          <label>URL  <input name="url"  .value=${this.bm?.url  ?? ""}></label>
          <label>Description
            <textarea name="description">${this.bm?.description ?? ""}</textarea>
          </label>
        </mu-form>
      </main>
    `;
  }

  private handleSubmit = (e: Form.SubmitEvent<Bookmark>) => {
    this.dispatchMessage([
      "bookmark/save",
      {
        id: this.id,
        bookmark: e.detail,
        onSuccess: () =>
          History.dispatch(this, "history/navigate",
            { href: "/app/bookmarks" }),
        onFailure: err => console.error(err)
      }
    ]);
  };
}
