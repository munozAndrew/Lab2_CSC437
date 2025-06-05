import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { apiFetch } from "../utils/api";
import "../components/bookmark-form";

@customElement("bookmarks-view")
export class BookmarksViewElement extends LitElement {
  @state() private bookmarks: any[] = [];
  @state() private error?: string;

  static styles = css`
    :host { display:block; padding:1rem; }
    ul { list-style:none; padding:0; }
    li { padding:.5rem 0; border-bottom:1px solid #ccc; }
    a { text-decoration:none; color:royalblue; }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.load();
    this.addEventListener("bookmark:created",
      (e: Event) => this.bookmarks = [...this.bookmarks, (e as CustomEvent).detail]
    );
  }

  private load() {
    apiFetch("/api/bookmarks")
      .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
      .then(list => { this.bookmarks = list; })
      .catch(err => { this.error = err; });
  }

  render() {
    return html`
      <h2>Your bookmarks</h2>
      ${this.bookmarks.length
        ? html`<ul>
            ${this.bookmarks.map(bm => html`
              <li>
                <a href=${bm.url} target="_blank">${bm.name}</a>
                ${bm.description ? html`<small> – ${bm.description}</small>` : null}
              </li>`)}
          </ul>`
        : html`<p>No bookmarks yet.</p>`}

      <h3>Add new bookmark</h3>
      <bookmark-form></bookmark-form>
      ${this.error ? html`<p class="error">${this.error}</p>` : null}
    `;
  }
}
