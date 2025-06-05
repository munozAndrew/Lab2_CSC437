import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { apiFetch } from "../utils/api";

@customElement("bookmark-form")
export class BookmarkFormElement extends LitElement {
  @state() private data = { name: "", url: "", description: "" };
  @state() private error?: string;

  static styles = css`
    form { display:grid; gap:.5rem; max-width:320px; }
    input, textarea { padding:.5rem; font:inherit; }
    .error { color:red; }
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
        <input placeholder="Name" name="name" .value=${name} required />
        <input placeholder="https://example.com" name="url" .value=${url} required />
        <textarea placeholder="Description (optional)"
                  name="description"
                  rows="3">${description}</textarea>
        <button type="submit" ?disabled=${disabled}>Add bookmark</button>
        ${this.error ? html`<p class="error">${this.error}</p>` : null}
      </form>
    `;
  }
}
