import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { apiFetch } from "../utils/api";

@customElement("group-card")
export class GroupCardElement extends LitElement {
  @property({ type: Object }) group!: {
    id: string;
    name: string;
    description?: string;
    bookmarkIds: string[];
  };

  @state() private bookmarks: any[] = [];
  @state() private error?: string;

  static styles = css`
    article { border:1px solid #ccc; border-radius:8px; padding:1rem;
              box-shadow:0 2px 6px rgba(0,0,0,.05); }
    h3 { margin:0 0 .25rem 0; }
    ul { list-style:none; padding:0; }
    li { margin:.25rem 0; }
    a { color:royalblue; text-decoration:none; }
  `;

  connectedCallback() {
    super.connectedCallback();
    if (this.group?.bookmarkIds?.length) this.loadBookmarks();
  }

  private loadBookmarks() {
    const qs = this.group.bookmarkIds.map(id => `id=${id}`).join("&");
    apiFetch(`/api/bookmarks?${qs}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(list => (this.bookmarks = list))
      .catch(err => (this.error = err));
  }

  render() {
    const g = this.group;
    return html`
      <article>
        <h3>${g.name}</h3>
        ${g.description ? html`<p>${g.description}</p>` : null}

        ${this.bookmarks.length
          ? html`<ul>
              ${this.bookmarks.map(bm =>
                html`<li><a href=${bm.url} target="_blank">${bm.name}</a></li>`)}
            </ul>`
          : html`<p class="dim">${g.bookmarkIds.length
              ? "Loading bookmarks…"
              : "No bookmarks yet."}</p>`}

        ${this.error ? html`<p class="error">${this.error}</p>` : null}
      </article>
    `;
  }
}
