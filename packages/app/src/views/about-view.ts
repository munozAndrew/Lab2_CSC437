// packages/app/src/views/about-view.ts
import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("about-view")
export class AboutViewElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .hero {
      background: white;
      border: 1px solid rgb(229, 231, 235);
      border-radius: 1rem;
      padding: 3rem;
      text-align: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      margin-bottom: 3rem;
    }

    .hero h1 {
      color: rgb(59, 130, 246);
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .hero p {
      color: rgb(75, 85, 99);
      font-size: 1.25rem;
      line-height: 1.6;
      margin: 0;
      max-width: 600px;
      margin: 0 auto;
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .feature-card {
      background: white;
      border: 1px solid rgb(229, 231, 235);
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .feature-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      display: block;
    }

    .feature-card h3 {
      color: rgb(59, 130, 246);
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .feature-card p {
      color: rgb(75, 85, 99);
      line-height: 1.6;
      margin: 0;
    }

    .workflow {
      background: white;
      border: 1px solid rgb(229, 231, 235);
      border-radius: 1rem;
      padding: 3rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      margin-bottom: 3rem;
    }

    .workflow h2 {
      color: rgb(59, 130, 246);
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 2rem;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .workflow-steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .workflow-step {
      text-align: center;
      position: relative;
    }

    .step-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      background: rgb(59, 130, 246);
      color: white;
      border-radius: 50%;
      font-weight: 700;
      font-size: 1.25rem;
      margin-bottom: 1rem;
    }

    .workflow-step h4 {
      color: rgb(55, 65, 81);
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .workflow-step p {
      color: rgb(75, 85, 99);
      line-height: 1.5;
      margin: 0;
    }

    .getting-started {
      background: linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(37, 99, 235) 100%);
      border-radius: 1rem;
      padding: 3rem;
      text-align: center;
      color: white;
    }

    .getting-started h2 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .getting-started p {
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s;
      border: 2px solid transparent;
    }

    .btn-primary {
      background: white;
      color: rgb(59, 130, 246);
    }

    .btn-primary:hover {
      background: rgb(243, 244, 246);
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: transparent;
      color: white;
      border-color: rgba(255, 255, 255, 0.3);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
    }

    @media (max-width: 768px) {
      :host {
        padding: 1rem;
      }

      .hero {
        padding: 2rem 1rem;
      }

      .hero h1 {
        font-size: 2.5rem;
      }

      .hero p {
        font-size: 1.1rem;
      }

      .features {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .feature-card {
        padding: 1.5rem;
      }

      .workflow {
        padding: 2rem 1rem;
      }

      .workflow-steps {
        grid-template-columns: 1fr;
      }

      .getting-started {
        padding: 2rem 1rem;
      }

      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }

      .btn {
        width: 100%;
        max-width: 200px;
        justify-content: center;
      }
    }
  `;

  render() {
    return html`
      <div class="hero">
        <h1>TabSaver</h1>
        <p>Your bookmark management solution. Save, organize, and schedule your favorite websites with ease.</p>
      </div>

      <div class="features">
        <div class="feature-card">
          <span class="feature-icon">🔖</span>
          <h3>Smart Bookmarking</h3>
          <p>Save any website URL with custom names and detailed descriptions. Never lose track of important resources again.</p>
        </div>

        <div class="feature-card">
          <span class="feature-icon">📂</span>
          <h3>Organized Groups</h3>
          <p>Create custom groups to categorize your bookmarks. Keep work, personal, and project links perfectly organized.</p>
        </div>

        <div class="feature-card">
          <span class="feature-icon">📅</span>
          <h3>Weekly Scheduler</h3>
          <p>Plan your browsing with our 7-day calendar. Assign bookmark groups to specific days for structured web navigation.</p>
        </div>
      </div>

      <div class="workflow">
        <h2>How It Works</h2>
        <div class="workflow-steps">
          <div class="workflow-step">
            <div class="step-number">1</div>
            <h4>Save Bookmarks</h4>
            <p>Add websites with custom names and descriptions for easy identification.</p>
          </div>

          <div class="workflow-step">
            <div class="step-number">2</div>
            <h4>Create Groups</h4>
            <p>Organize your bookmarks into themed groups like "Work Tools" or "Learning Resources".</p>
          </div>

          <div class="workflow-step">
            <div class="step-number">3</div>
            <h4>Schedule Access</h4>
            <p>Assign groups to specific days of the week to create a structured browsing routine.</p>
          </div>

          <div class="workflow-step">
            <div class="step-number">4</div>
            <h4>Stay Organized</h4>
            <p>Access your scheduled content each day and maintain a focused, productive workflow.</p>
          </div>
        </div>
      </div>

      <div class="getting-started">
        <h2>Ready to Get Organized?</h2>
        <p>Transform the way you manage your online resources. Start building your personalized bookmark system today.</p>
        <div class="cta-buttons">
          <a href="/app/bookmarks" class="btn btn-primary">View Bookmarks</a>
          <a href="/app/groups" class="btn btn-secondary">Manage Groups</a>
        </div>
      </div>
    `;
  }
}