import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { apiFetch } from "../utils/api";

@customElement("bookmark-form")
export class BookmarkFormElement extends LitElement {
  @state() private data = { name: "", url: "", description: "" };
  @state() private error?: string;

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

    @media (max-width: 768px) {
      form {
        padding: 1.5rem;
        max-width: 100%;
      }

      input, textarea, button {
        font-size: 16px;
      }
    }
  `;

  private handleChange(e: Event) {
    const t = e.target as HTMLInputElement | HTMLTextAreaElement;
    this.data = { ...this.data, [t.name]: t.value };
  }

  private handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const body = {
      ...this.data,
      id: crypto.randomUUID()
    };
    apiFetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
      .then(res => {
        if (res.status !== 201) throw new Error(res.statusText);
        return res.json();
      })
      .then(newBm => {
        this.dispatchEvent(new CustomEvent("bookmark:created", {
          bubbles: true, composed: true, detail: newBm
        }));
        this.data = { name: "", url: "", description: "" };
        this.error = undefined;
      })
      .catch(err => (this.error = err.message));
  };

  render() {
    const { name, url, description } = this.data;
    const disabled = !(name && url);
    return html`
      <form @input=${this.handleChange} @submit=${this.handleSubmit}>
        <input placeholder="Bookmark Name" name="name" .value=${name} required />
        <input placeholder="https://example.com" name="url" .value=${url} required type="url" />
        <textarea placeholder="Description (optional)"
                  name="description"
                  rows="3">${description}</textarea>
        <button type="submit" ?disabled=${disabled}>Add Bookmark</button>
        ${this.error ? html`<p class="error">${this.error}</p>` : null}
      </form>
    `;
  }
}