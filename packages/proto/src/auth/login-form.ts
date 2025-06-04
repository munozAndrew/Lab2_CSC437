// src/auth/login-form.ts
import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

interface LoginFormData {
  username?: string;
  password?: string;
}

export class LoginFormElement extends LitElement {
  @state()
  private formData: LoginFormData = {};

  @property()
  api?: string;

  @property()
  redirect: string = "/";

  @state()
  private error?: string;

  static styles = css`
    form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .error {
      color: red;
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }
    button[disabled] {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;

  get canSubmit(): boolean {
    return Boolean(
      this.api &&
        this.formData.username &&
        this.formData.password
    );
  }

  override render() {
    return html`
      <form
        @change=${(e: InputEvent) => this.handleChange(e)}
        @submit=${(e: SubmitEvent) => this.handleSubmit(e)}
      >
        <slot></slot>
        <slot name="button">
          <button ?disabled=${!this.canSubmit} type="submit">
            Login
          </button>
        </slot>
        <div class="error">${this.error || ""}</div>
      </form>
    `;
  }

  private handleChange(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    const name = target.name;
    const value = target.value;
    const prev = this.formData;
    if (name === "username") {
      this.formData = { ...prev, username: value };
    } else if (name === "password") {
      this.formData = { ...prev, password: value };
    }
  }

  private handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    if (!this.canSubmit) {
      return;
    }
    fetch(this.api!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.formData),
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Login failed");
        }
        return res.json();
      })
      .then((json: { token: string }) => {
        const { token } = json;
        const detail: [string, any] = [
          "auth/signin",
          { token, redirect: this.redirect },
        ];
        this.dispatchEvent(
          new CustomEvent("auth:message", {
            bubbles: true,
            composed: true,
            detail,
          })
        );
      })
      .catch((err: Error) => {
        this.error = err.message;
      });
  }
}
