import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

interface LoginFormData { username?: string; password?: string; }

export class LoginFormElement extends LitElement {
  @state() private formData: LoginFormData = {};
  @property() api?: string;
  @property() redirect = "/";
  @state() private error?: string;

  static styles = css`
    form { display:flex; flex-direction:column; gap:.5rem; }
    .error { color:red; font-size:.9rem; }
    button[disabled] { opacity:.6; cursor:not-allowed; }
  `;

  private get canSubmit() {
    const { username, password } = this.formData;
    return Boolean(this.api && username?.length && password?.length);
  }

  render() {
    return html`
      <form
        @change=${this.handleChange}
        @submit=${this.handleSubmit}>
        <slot></slot>
        <slot name="button">
          <button ?disabled=${!this.canSubmit} type="submit">Login</button>
        </slot>
        ${this.error ? html`<div class="error">${this.error}</div>` : null}
      </form>`;
  }

  private handleChange = (e: InputEvent) => {
    const t = e.target as HTMLInputElement;
    this.formData = { ...this.formData, [t.name]: t.value };
  };

  private handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (!this.canSubmit) return;

    fetch(this.api!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.formData)
    })
      .then(res => {
        if (res.status !== 200) throw new Error("Login failed");
        return res.json() as Promise<{ token: string }>;
      })
      .then(({ token }) => {
        this.dispatchEvent(new CustomEvent("auth:message", {
          bubbles: true,
          composed: true,
          detail: ["auth/signin", { token, redirect: this.redirect }]
        }));
      })
      .catch(err => (this.error = err.message));
  };
}
