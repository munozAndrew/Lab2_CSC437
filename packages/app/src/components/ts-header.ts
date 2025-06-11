import { css, html, LitElement } from "lit";
export class HeaderElement extends LitElement {
static styles = css`
  header {
    padding: 1.5rem 2rem;
    background: linear-gradient(135deg, rgb(30, 41, 59), rgb(51, 65, 85));
    color: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h1 {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 700;
    background: linear-gradient(45deg, rgb(96, 165, 250), rgb(147, 197, 253));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  nav {
    display: flex;
    gap: 0.5rem;
  }

  a {
    color: rgb(203, 213, 225);
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.2s;
    font-size: 0.95rem;
  }

  a:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transform: translateY(-1px);
  }

  a:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
      padding: 1rem;
    }

    nav {
      justify-content: center;
      flex-wrap: wrap;
    }

    h1 {
      font-size: 1.5rem;
    }
  }
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
          <a href="/app/login">Login</a>

        </nav>
      </header>`;
  }
}
