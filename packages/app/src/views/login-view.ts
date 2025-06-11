import { html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { View, Form } from "@calpoly/mustang";
import { LoginFormElement } from "../auth/login-form";
import { Model } from "../model";
import { Msg } from "../messages";

@customElement("login-view")
export class LoginViewElement extends View<Model, Msg> {
  static uses = { 
    "login-form": LoginFormElement,
    "mu-form": Form.Element 
  };

  constructor() { 
    super("tabsaver:model"); 
  }

  static styles = css`
    :host {
      display: flex;
      place-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      font-family: system-ui, -apple-system, sans-serif;
      background: rgb(249, 250, 251);
      padding: 1rem;
    }

    .card {
      display: grid;
      gap: 1.5rem;
      max-width: 400px;
      width: 100%;
      background: white;
      border: 1px solid rgb(229, 231, 235);
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: rgb(17, 24, 39);
      text-align: center;
    }

    login-form {
      display: block;
    }

    login-form form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-weight: 500;
      color: rgb(55, 65, 81);
    }

    input {
      padding: 0.75rem;
      border: 1px solid rgb(209, 213, 219);
      border-radius: 0.5rem;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.2s, box-shadow 0.2s;
      background: white;
    }

    input:focus {
      outline: none;
      border-color: rgb(59, 130, 246);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    input::placeholder {
      color: rgb(156, 163, 175);
    }

    button {
      padding: 0.75rem 1.5rem;
      background: rgb(59, 130, 246);
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s, transform 0.1s;
      font-family: inherit;
    }

    button:hover:not(:disabled) {
      background: rgb(37, 99, 235);
      transform: translateY(-1px);
    }

    button:active:not(:disabled) {
      transform: translateY(0);
    }

    button:disabled {
      background: rgb(156, 163, 175);
      cursor: not-allowed;
      transform: none;
    }

    .register-link {
      text-align: center;
      font-size: 0.9rem;
      color: rgb(107, 114, 128);
      margin: 0;
    }

    .register-link a {
      color: rgb(59, 130, 246);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }

    .register-link a:hover {
      color: rgb(37, 99, 235);
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .card {
        padding: 1.5rem;
        max-width: 100%;
      }

      input, button {
        font-size: 16px;
      }
    }
  `;

  render() {
    return html`
      <div class="card">
        <h2>User Login</h2>
        
        <login-form api="/auth/login" redirect="/app">
          <label>
            Username:
            <input name="username" autocomplete="off" placeholder="Enter your username" />
          </label>
          <label>
            Password:
            <input name="password" type="password" placeholder="Enter your password" />
          </label>
        </login-form>
        
        <p class="register-link">
          New user?
          <a href="/app/register">Register here</a>
        </p>
      </div>
    `;
  }
}