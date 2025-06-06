import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { apiFetch } from "../utils/api";

interface Bookmark {
  id: string;
  name: string;
  url: string;
  description?: string;
}

@customElement("group-form")
export class GroupFormElement extends LitElement {
  @state() private data = { name: "", description: "" };
  @state() private error?: string;
  @state() private bookmarks: Bookmark[] = [];
  @state() private selectedBookmarkIds: Set<string> = new Set();
  @state() private loading = true;

  static styles = css`
    :host {
      display: block;
    }

    form {
      display: grid;
      gap: 1.5rem;
      max-width: 500px;
      background: white;
      border: 1px solid rgb(229, 231, 235);
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    input, textarea {
      padding: 0.75rem;
      border: 1px solid rgb(209, 213, 219);
      border-radius: 0.5rem;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.2s, box-shadow 0.2s;
      background: white;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: rgb(59, 130, 246);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    input::placeholder, textarea::placeholder {
      color: rgb(156, 163, 175);
    }

    textarea {
      min-height: 80px;
      resize: vertical;
      font-family: inherit;
    }

    button {
      padding: 0.75rem 1.5rem;
      background: rgb(59, 130, 246);
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s, transform 0.1s;
      font-family: inherit;
    }

    button:hover:not(:disabled) {
      background: rgb(37, 99, 235);
      transform: translateY(-1px);
    }

    button:active:not(:disabled) {
      transform: translateY(0);
    }

    button:disabled {
      background: rgb(156, 163, 175);
      cursor: not-allowed;
      transform: none;
    }

    .error {
      background: rgb(254, 242, 242);
      color: rgb(185, 28, 28);
      padding: 0.75rem;
      border-radius: 0.5rem;
      border: 1px solid rgb(252, 165, 165);
      font-size: 0.9rem;
      margin: 0;
    }

    .bookmarks-section {
      display: grid;
      gap: 1rem;
    }

    .bookmarks-header {
      font-size: 1rem;
      font-weight: 600;
      color: rgb(55, 65, 81);
      margin: 0;
    }

    .bookmarks-list {
      display: grid;
      gap: 0.5rem;
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid rgb(229, 231, 235);
      border-radius: 0.5rem;
      padding: 0.75rem;
      background: rgb(249, 250, 251);
    }

    .bookmark-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      border-radius: 0.375rem;
      background: white;
      border: 1px solid rgb(229, 231, 235);
      cursor: pointer;
      transition: background-color 0.2s, border-color 0.2s;
    }

    .bookmark-item:hover {
      background: rgb(243, 244, 246);
      border-color: rgb(209, 213, 219);
    }

    .bookmark-item.selected {
      background: rgb(239, 246, 255);
      border-color: rgb(59, 130, 246);
    }

    .bookmark-checkbox {
      width: 1rem;
      height: 1rem;
      cursor: pointer;
    }

    .bookmark-info {
      flex: 1;
      min-width: 0;
    }

    .bookmark-name {
      font-weight: 500;
      color: rgb(17, 24, 39);
      margin: 0 0 0.25rem 0;
      font-size: 0.9rem;
    }

    .bookmark-url {
      color: rgb(107, 114, 128);
      font-size: 0.8rem;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .loading {
      text-align: center;
      color: rgb(107, 114, 128);
      font-style: italic;
    }

    .no-bookmarks {
      text-align: center;
      color: rgb(107, 114, 128);
      font-style: italic;
      padding: 1rem;
    }

    .selection-summary {
      font-size: 0.9rem;
      color: rgb(107, 114, 128);
      margin: 0;
    }

    @media (max-width: 768px) {
      form {
        padding: 1.5rem;
        max-width: 100%;
      }

      input, textarea, button {
        font-size: 16px;
      }

      .bookmarks-list {
        max-height: 150px;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.loadBookmarks();
  }

  private async loadBookmarks() {
    try {
      const response = await apiFetch("/api/bookmarks");
      if (response.ok) {
        this.bookmarks = await response.json();
      } else {
        this.error = "Failed to load bookmarks";
      }
    } catch (err) {
      this.error = "Failed to load bookmarks";
    } finally {
      this.loading = false;
    }
  }

  private handleChange(e: Event) {
    const t = e.target as HTMLInputElement | HTMLTextAreaElement;
    this.data = { ...this.data, [t.name]: t.value };
  }

  private handleBookmarkToggle(bookmarkId: string) {
    const newSelected = new Set(this.selectedBookmarkIds);
    if (newSelected.has(bookmarkId)) {
      newSelected.delete(bookmarkId);
    } else {
      newSelected.add(bookmarkId);
    }
    this.selectedBookmarkIds = newSelected;
  }

  private handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const body = {
      ...this.data,
      id: crypto.randomUUID(),
      bookmarkIds: Array.from(this.selectedBookmarkIds)
    };
    
    apiFetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
      .then(res => res.status === 201 ? res.json() : Promise.reject(res.statusText))
      .then(newGroup => {
        this.dispatchEvent(new CustomEvent("group:created", {
          bubbles: true, composed: true, detail: newGroup
        }));
        this.data = { name: "", description: "" };
        this.selectedBookmarkIds = new Set();
        this.error = undefined;
      })
      .catch(err => (this.error = err));
  };

  render() {
    const { name, description } = this.data;
    const selectedCount = this.selectedBookmarkIds.size;
    
    return html`
      <form @input=${this.handleChange} @submit=${this.handleSubmit}>
        <input 
          name="name" 
          placeholder="Group name" 
          .value=${name} 
          required 
        />
        
        <textarea 
          name="description" 
          rows="2"
          placeholder="Description (optional)"
        >${description}</textarea>

        <div class="bookmarks-section">
          <h3 class="bookmarks-header">Select Bookmarks for Group</h3>
          
          ${this.loading ? html`
            <div class="loading">Loading bookmarks...</div>
          ` : this.bookmarks.length === 0 ? html`
            <div class="no-bookmarks">
              No bookmarks available. Create a couple of bookmarks first to add them to groups.
            </div>
          ` : html`
            <div class="bookmarks-list">
              ${this.bookmarks.map(bookmark => html`
                <div 
                  class="bookmark-item ${this.selectedBookmarkIds.has(bookmark.id) ? 'selected' : ''}"
                  @click=${() => this.handleBookmarkToggle(bookmark.id)}
                >
                  <input 
                    type="checkbox" 
                    class="bookmark-checkbox"
                    .checked=${this.selectedBookmarkIds.has(bookmark.id)}
                    @change=${(e: Event) => e.stopPropagation()}
                  />
                  <div class="bookmark-info">
                    <p class="bookmark-name">${bookmark.name}</p>
                    <p class="bookmark-url">${bookmark.url}</p>
                  </div>
                </div>
              `)}
            </div>
            
            ${selectedCount > 0 ? html`
              <p class="selection-summary">
                ${selectedCount} bookmark${selectedCount === 1 ? '' : 's'} selected
              </p>
            ` : ''}
          `}
        </div>

        <button type="submit" ?disabled=${!name}>
          Add Group
        </button>
        
        ${this.error ? html`<p class="error">${this.error}</p>` : null}
      </form>
    `;
  }
}