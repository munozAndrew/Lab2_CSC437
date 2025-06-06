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
    :host {
      display: block;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    h2, h3 {
      color: rgb(59, 130, 246);
      font-weight: 700;
      margin-bottom: 1.5rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    h2 {
      font-size: 2.25rem;
      margin-top: 0;
    }

    h3 {
      font-size: 1.5rem;
      margin-top: 3rem;
      border-top: 1px solid rgb(229, 231, 235);
      padding-top: 2rem;
    }

    ul {
      list-style: none;
      padding: 0;
      background: white;
      border: 1px solid rgb(229, 231, 235);
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    li {
      padding: 1.5rem;
      border-bottom: 1px solid rgb(243, 244, 246);
      transition: background-color 0.2s;
    }

    li:last-child {
      border-bottom: none;
    }

    li:hover {
      background-color: rgb(249, 250, 251);
    }

    a {
      color: rgb(59, 130, 246);
      text-decoration: none;
      font-weight: 500;
      font-size: 1.1rem;
      transition: color 0.2s;
    }

    a:hover {
      color: rgb(37, 99, 235);
      text-decoration: underline;
    }

    .edit {
      margin-left: 1rem;
      font-size: 1rem;
      color: rgb(107, 114, 128);
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      transition: background-color 0.2s, color 0.2s;
    }

    .edit:hover {
      background-color: rgb(243, 244, 246);
      color: rgb(55, 65, 81);
    }

    small {
      display: block;
      color: rgb(107, 114, 128);
      font-size: 0.9rem;
      margin-top: 0.5rem;
      line-height: 1.4;
    }

    p {
      color: rgb(75, 85, 99);
      font-size: 1.1rem;
      text-align: center;
      padding: 2rem;
      background: white;
      border: 1px solid rgb(229, 231, 235);
      border-radius: 1rem;
      margin: 0;
    }

    @media (max-width: 768px) {
      :host {
        padding: 1rem;
      }

      h2 {
        font-size: 2rem;
      }

      h3 {
        font-size: 1.25rem;
      }

      li {
        padding: 1rem;
      }

      .edit {
        display: block;
        margin-left: 0;
        margin-top: 0.5rem;
      }
    }
  `;

  render() {
    return html`
      <h2>Your Bookmarks</h2>

      ${this.list.length
        ? html`
            <ul>
              ${this.list.map(b => html`
                <li>
                  <a href=${b.url} target="_blank">${b.name}</a>
                  <a class="edit" href="/app/bookmarks/${b.id}/edit"
                     title="Edit bookmark">✎ Edit</a>
                  ${b.description
                    ? html`<small>${b.description}</small>` : null}
                </li>`)}
            </ul>`
        : html`<p>Loading your bookmarks...</p>`}

      <h3>Add New Bookmark</h3>
      <bookmark-form></bookmark-form>
    `;
  }
}