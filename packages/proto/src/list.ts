
import { html, css, LitElement } from "lit";
import reset from './styles/reset.css.ts';

export class IndexListing extends LitElement {
  static styles =[reset.styles,
     css`
    
    ul {
      padding-left: 1em;
      list-style: disc;
      list-style-position: inside;
      padding: 0;
      margin: 0;
    }
    ::slotted(li) {
      display: list-item;
      padding: 0.5em 0;
      border-bottom: 1px solid #eee;
    }
  ` ];

  override render() {
    return html`<ul><slot></slot></ul>`;
  }
}