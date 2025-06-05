import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { apiFetch } from "../utils/api";

@customElement("group-form")
export class GroupFormElement extends LitElement {
  @state() private data = { name: "", description: "" };
  @state() private error?: string;

  static styles = css`
    form { display:grid; gap:.5rem; max-width:320px; margin-top:1rem; }
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
      id: crypto.randomUUID(),
      bookmarkIds: []
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
        this.error = undefined;
      })
      .catch(err => (this.error = err));
  };

  render() {
    const { name, description } = this.data;
    return html`
      <form @input=${this.handleChange} @submit=${this.handleSubmit}>
        <input name="name" placeholder="Group name" .value=${name} required />
        <textarea name="description" rows="2"
                  placeholder="Description (optional)">${description}</textarea>
        <button type="submit" ?disabled=${!name}>Add Group</button>
        ${this.error ? html`<p class="error">${this.error}</p>` : null}
      </form>
    `;
  }
}
