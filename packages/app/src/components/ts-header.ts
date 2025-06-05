import { css, html, LitElement } from "lit";
export class HeaderElement extends LitElement {
  static styles = css`
    header { padding:1rem; background:#20232a; color:white; }
    a      { color:#61dafb; margin-inline:.5rem; text-decoration:none; }
  `;
  render() {
    return html`
      <header>
        <h1 style="display:inline">TabSaver</h1>
        <nav style="display:inline">
          <a href="/app">Home</a>
          <a href="/app/about">About</a>
          <a href="/app/bookmarks">Bookmarks</a>
          <a href="/app/groups">Groups</a>
        </nav>
      </header>`;
  }
}
