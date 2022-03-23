import { css } from "../utils/css.ts";

export class CtlgMenubar extends HTMLElement {
  static defaultTagName = "ctlg-menubar" as const;

  static define(tagName: string = this.defaultTagName): void {
    if (!customElements.get(tagName)) {
      customElements.define(tagName, this);
    }
  }

  constructor() {
    super();

    const shadowRoot = this.attachShadow({
      mode: "open",
    });

    const style = document.createElement("style");
    style.textContent = css`
      :host {
        display: flex;
        justify-content: start;
        align-items: stretch;
        padding: 0px 2px;
      }
    `;
    shadowRoot.appendChild(style);

    const slot = document.createElement("slot");
    shadowRoot.appendChild(slot);
  }
}
