import { css, html, LitElement } from "lit";

export class HomeViewElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    section {
      background: white;
      border: 1px solid rgb(229, 231, 235);
      border-radius: 1rem;
      padding: 3rem;
      text-align: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    h2 {
      color: rgb(59, 130, 246);
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    p {
      color: rgb(75, 85, 99);
      font-size: 1.25rem;
      line-height: 1.6;
      margin: 0;
    }

    @media (max-width: 768px) {
      :host {
        padding: 1rem;
      }

      section {
        padding: 2rem 1rem;
      }

      h2 {
        font-size: 2rem;
      }

      p {
        font-size: 1rem;
      }
    }
  `;

  render() {
    return html`
      <section>
        <h2>Welcome to TabSaver!</h2>
        <p>Your bookmark management app is ready!</p>
      </section>
    `;
  }
}