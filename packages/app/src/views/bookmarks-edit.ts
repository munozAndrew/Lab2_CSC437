// packages/app/src/views/bookmark-edit.ts
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

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    main {
      background: white;
      border: 1px solid rgb(229, 231, 235);
      border-radius: 1rem;
      padding: 3rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    h2 {
      color: rgb(59, 130, 246);
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 2rem;
      margin-top: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    mu-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-weight: 600;
      color: rgb(55, 65, 81);
      font-size: 1rem;
    }

    input, textarea {
      padding: 0.75rem;
      border: 1px solid rgb(209, 213, 219);
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
      font-family: inherit;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: rgb(59, 130, 246);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    textarea {
      min-height: 100px;
      resize: vertical;
    }

    @media (max-width: 768px) {
      :host {
        padding: 1rem;
      }

      main {
        padding: 2rem 1rem;
      }

      h2 {
        font-size: 1.75rem;
      }
    }
  `;

  render() {
    return html`
      <main class="page">
        <h2>Edit Bookmark</h2>
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