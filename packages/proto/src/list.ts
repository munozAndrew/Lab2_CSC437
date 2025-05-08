import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';

export class IndexListing extends LitElement {
  @property() src?: string;
  @state() items: Array<{ title: string; href: string }> = [];

  static styles = css`
    ul { list-style: none; padding: 0; margin: 0; }
    li { padding: 0.5em 0; border-bottom: 1px solid #eee; }
    a { text-decoration: none; }
  `;

  connectedCallback() {
    super.connectedCallback();
    if (this.src) this.hydrate(this.src);
  }

  private async hydrate(src: string) {
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error(res.statusText);
      this.items = await res.json();
    } catch (e) {
      console.error('Failed to load listing data:', e);
    }
  }

  override render() {
    return html`
      <ul>
        ${this.items.length
          ? this.items.map(
              item => html`
                <li>
                  <a href=${item.href}>${item.title}</a>
                </li>`
            )
          : html`<slot></slot>`}
      </ul>
    `;
  }
}
