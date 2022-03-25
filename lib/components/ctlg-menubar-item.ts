import { css } from "../utils/css.ts";

export class CtlgMenubarItem extends HTMLElement {
  static defaultTagName = "ctlg-menubar-item" as const;

  static define(tagName: string = this.defaultTagName): void {
    if (!customElements.get(tagName)) {
      customElements.define(tagName, this);
    }
  }

  get opened(): boolean {
    return this.#opened;
  }

  set opened(value: boolean) {
    this.#opened = value;
    this.setAttribute("opened", String(value));
  }

  #opened = false;

  constructor() {
    super();

    // 1. Create nodes
    const shadowRoot = this.attachShadow({
      mode: "open",
    });

    const style = document.createElement("style");
    style.textContent = css`
      :host {
        cursor: default;
      }
      :host(:not(:first-child)) {
        border-left: 1px solid currentColor;
      }
    `;
    shadowRoot.appendChild(style);

    const slot = document.createElement("slot");
    shadowRoot.appendChild(slot);

    // 2. Configure ARIA attributes
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "menuitem");
    }

    if (!this.hasAttribute("aria-haspopup")) {
      this.setAttribute("aria-haspopup", "true");
    }

    // 3. Initialize properties based on attributes
    this.opened = this.getAttribute("opened") === "true";
  }
}
