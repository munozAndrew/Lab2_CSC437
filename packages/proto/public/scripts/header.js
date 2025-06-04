
import { LitElement, html, css } from "https://cdn.jsdelivr.net/npm/lit@2/+esm";
import { state, customElement } from "https://cdn.jsdelivr.net/npm/lit@2/decorators.js?module";
import { Observer } from "@calpoly/mustang";

@customElement("ts-header")
export class HeaderElement extends LitElement {
  _authObserver = new Observer(this, "tabsaver:auth");

  @state()
  loggedIn = false;

  @state()
  userid = "";

  constructor() {
    super();
    this._authObserver.observe((authModel) => {
      const user = authModel.user;
      if (user && user.authenticated) {
        this.loggedIn = true;
        this.userid = user.username;
      } else {
        this.loggedIn = false;
        this.userid = "";
      }
    });
  }

  static styles = css`
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 1rem;
      background-color: var(--color-primary, #222);
      color: white;
    }
    .greeting {
      margin-right: 1rem;
      font-size: 1rem;
    }
    button, a {
      background: none;
      border: 1px solid white;
      color: white;
      padding: 0.25rem 0.5rem;
      font-size: 1rem;
      text-decoration: none;
      cursor: pointer;
    }
    a {
      border: none;
    }
    a:hover, button:hover {
      opacity: 0.8;
    }
  `;

  render() {
    return html`
      <header>
        <div>
          <h1>Tab Saver</h1>
        </div>
        <div>
          ${this.loggedIn
            ? html`
                <span class="greeting">Hello, ${this.userid}</span>
                <button @click=${this._onSignOut}>Sign Out</button>
              `
            : html`
                <a href="/login.html">Sign In</a>
              `}
        </div>
      </header>
    `;
  }

  _onSignOut() {
    this.dispatchEvent(
      new CustomEvent("auth:message", {
        detail: ["auth/signout"],
        bubbles: true,
        composed: true,
      })
    );
  }
}
