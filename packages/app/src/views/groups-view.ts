// packages/app/src/views/groups-view.ts
import { css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { View } from "@calpoly/mustang";
import { Model } from "../model";
import { Msg } from "../messages";
import "../components/group-card";
import "../components/group-form";

@customElement("groups-view")
export class GroupsViewElement extends View<Model, Msg> {
  constructor() { super("tabsaver:model"); }

  @state()
  get list() { return this.model.groups ?? []; }

  connectedCallback() {
    super.connectedCallback();

    if (!this.model.groups) {
      this.dispatchMessage(["groups/load", {}]);
    }

    this.addEventListener("group:created",
      () => this.dispatchMessage(["groups/load", {}]));
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

    main {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    p {
      color: rgb(75, 85, 99);
      font-size: 1.1rem;
      text-align: center;
      padding: 3rem;
      background: white;
      border: 1px solid rgb(229, 231, 235);
      border-radius: 1rem;
      margin: 0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    group-form {
      background: white;
      border: 1px solid rgb(229, 231, 235);
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      display: block;
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

      main {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      group-form {
        padding: 1.5rem;
      }

      p {
        padding: 2rem 1rem;
      }
    }
  `;

  render() {
    return html`
      <h2>Your Groups</h2>

      ${this.list.length
        ? html`
            <main>
              ${this.list.map(g => html`<group-card .group=${g}></group-card>`)}
            </main>`
        : html`<p>Loading your groups...</p>`}

      <h3>Create New Group</h3>
      <group-form></group-form>
    `;
  }
}