import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { apiFetch } from "../utils/api";
import "../components/group-card";
import "../components/group-form";

@customElement("groups-view")
export class GroupsViewElement extends LitElement {
  @state() private groups: any[] = [];
  @state() private error?: string;

  static styles = css`
    :host { display:block; padding:1rem; }
    main { display:grid; gap:1rem; }
    h2 { margin-top:0; }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.load();
    this.addEventListener("group:created",
      (e: Event) => this.groups = [...this.groups, (e as CustomEvent).detail]
    );
  }

  private load() {
    apiFetch("/api/groups")
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(list => (this.groups = list))
      .catch(err => (this.error = err));
  }

  render() {
    return html`
      <h2>Your groups</h2>

      ${this.groups.length
        ? html`<main>
            ${this.groups.map(g => html`<group-card .group=${g}></group-card>`)}
          </main>`
        : html`<p>No groups yet.</p>`}

      <h3>Create new group</h3>
      <group-form></group-form>
      ${this.error ? html`<p class="error">${this.error}</p>` : null}
    `;
  }
}
