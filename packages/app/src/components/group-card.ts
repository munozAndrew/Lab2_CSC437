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
  @state() private loading = false;

  static styles = css`
    article {
      border: 1px solid rgb(229, 231, 235);
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      background: white;
      transition: box-shadow 0.2s, transform 0.2s;
    }

    article:hover {
      box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    h3 {
      margin: 0 0 0.5rem 0;
      color: rgb(17, 24, 39);
      font-size: 1.25rem;
      font-weight: 600;
    }

    .description {
      color: rgb(107, 114, 128);
      margin: 0 0 1rem 0;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .open-all-btn {
      padding: 0.5rem 1rem;
      background: rgb(16, 185, 129);
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .open-all-btn:hover:not(:disabled) {
      background: rgb(5, 150, 105);
      transform: translateY(-1px);
    }

    .open-all-btn:disabled {
      background: rgb(156, 163, 175);
      cursor: not-allowed;
      transform: none;
    }

    .open-all-btn svg {
      width: 14px;
      height: 14px;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 0.5rem;
    }

    li {
      margin: 0;
    }

    a {
      color: rgb(59, 130, 246);
      text-decoration: none;
      font-size: 0.9rem;
      padding: 0.5rem 0.75rem;
      border-radius: 0.375rem;
      background: rgb(248, 250, 252);
      border: 1px solid rgb(226, 232, 240);
      display: block;
      transition: all 0.2s;
    }

    a:hover {
      background: rgb(239, 246, 255);
      border-color: rgb(59, 130, 246);
      color: rgb(37, 99, 235);
      transform: translateX(4px);
    }

    .dim {
      color: rgb(156, 163, 175);
      font-style: italic;
      margin: 0;
      font-size: 0.9rem;
    }

    .error {
      background: rgb(254, 242, 242);
      color: rgb(185, 28, 28);
      padding: 0.75rem;
      border-radius: 0.5rem;
      border: 1px solid rgb(252, 165, 165);
      font-size: 0.9rem;
      margin: 0.5rem 0 0 0;
    }

    .bookmark-count {
      color: rgb(107, 114, 128);
      font-size: 0.8rem;
      margin: 0.5rem 0 0 0;
    }

    .loading {
      color: rgb(107, 114, 128);
      font-style: italic;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .header-actions {
        flex-direction: column;
        gap: 0.5rem;
        align-items: stretch;
      }
      
      .open-all-btn {
        align-self: flex-end;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    if (this.group?.bookmarkIds?.length) {
      this.loadBookmarks();
    }
  }

  private async loadBookmarks() {
    if (!this.group.bookmarkIds.length) return;
    
    this.loading = true;
    this.error = undefined;

    try {
      //opt1
      let response = await apiFetch(`/api/bookmarks?ids=${this.group.bookmarkIds.join(',')}`);
      
      if (!response.ok) {
        //opt2
        const queryParams = new URLSearchParams();
        this.group.bookmarkIds.forEach(id => queryParams.append('id', id));
        response = await apiFetch(`/api/bookmarks?${queryParams.toString()}`);
      }

      if (!response.ok) {
        //opt3
        response = await apiFetch('/api/bookmarks');
        if (response.ok) {
          const allBookmarks = await response.json();
          this.bookmarks = allBookmarks.filter((bm: any) => 
            this.group.bookmarkIds.includes(bm.id)
          );
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const bookmarks = await response.json();
      this.bookmarks = Array.isArray(bookmarks) 
        ? bookmarks.filter((bm: any) => this.group.bookmarkIds.includes(bm.id))
        : [];

    } catch (err) {
      console.error('Error loading bookmarks for group:', this.group.id, err);
      this.error = err instanceof Error ? err.message : 'Failed to load bookmarks';
      this.bookmarks = [];
    } finally {
      this.loading = false;
    }
  }

  private handleOpenAll = () => {
    if (!this.bookmarks.length) return;
    
    this.bookmarks.forEach((bookmark, index) => {
      if (bookmark.url) {
        if (index === 0) {
          window.open(bookmark.url, '_blank', 'noopener,noreferrer');
        } else {
          // small dela
          setTimeout(() => {
            window.open(bookmark.url, '_blank', 'noopener,noreferrer');
          }, index * 100);
        }
      }
    });
    
    if (this.bookmarks.length > 5) {
      setTimeout(() => {
        alert(`atempted to open ${this.bookmarks.length} bookmark`);
      }, 500);
    }
  };

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('group')) {
      this.bookmarks = [];
      if (this.group?.bookmarkIds?.length) {
        this.loadBookmarks();
      }
    }
  }

  render() {
    const g = this.group;
    const hasBookmarks = this.bookmarks.length > 0;
    
    return html`
      <article>
        <div class="header-actions">
          <div>
            <h3>${g.name}</h3>
            ${g.description ? html`
              <p class="description">${g.description}</p>
            ` : ''}
          </div>
          
          ${hasBookmarks ? html`
            <button 
              class="open-all-btn" 
              @click=${this.handleOpenAll}
              ?disabled=${this.loading}
              title="Open all bookmarks in new tabs"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15,3 21,3 21,9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Open All
            </button>
          ` : ''}
        </div>

        ${this.loading ? html`
          <p class="loading">Loading bookmarks...</p>
        ` : hasBookmarks ? html`
          <ul>
            ${this.bookmarks.map(bm => html`
              <li>
                <a href=${bm.url} target="_blank" rel="noopener noreferrer">
                  ${bm.name}
                </a>
              </li>
            `)}
          </ul>
          <p class="bookmark-count">
            ${this.bookmarks.length} bookmark${this.bookmarks.length === 1 ? '' : 's'}
          </p>
        ` : html`
          <p class="dim">
            ${g.bookmarkIds.length > 0 ? 'No bookmarks found' : 'No bookmarks in this group'}
          </p>
        `}

        ${this.error ? html`
          <p class="error">Error: ${this.error}</p>
        ` : ''}
      </article>
    `;
  }
}