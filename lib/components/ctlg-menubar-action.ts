import { css } from "../utils/css.ts";

import {
  matchShortcutKey,
  parseAriaKeyshortcutsAttribute,
  ShortcutKey,
} from "../utils/shortcut_key.ts";

function keyToLabel(key: string): string {
  switch (key) {
    case " ":
      return "⎵";
    case "tab":
      return "↹";
    default:
      if (key.length === 1) {
        return key.toUpperCase();
      }

      return key;
  }
}

function kbd(text: string): HTMLElement {
  const el = document.createElement("kbd");
  el.className = "shortcut";
  el.textContent = text;
  return el;
}

function span(text: string): HTMLSpanElement {
  const el = document.createElement("span");
  el.textContent = text;
  return el;
}

export class CtlgMenubarAction extends HTMLElement {
  static defaultTagName = "ctlg-menubar-action" as const;

  static define(tagName: string = this.defaultTagName): void {
    if (!customElements.get(tagName)) {
      customElements.define(tagName, this);
    }
  }

  static get observedAttributes() {
    return ["shortcut"] as const;
  }

  // whether to use symbols such as ⌘ or ⌥
  useMacOSKeys: boolean = /^mac/i.test(navigator.platform);

  // whether to use Windows specific key symbols
  useWindowsKeys: boolean = /^win/i.test(navigator.platform);

  #shortcutKeys: readonly ShortcutKey[] = [];
  #shortcutLabel: HTMLElement = document.createElement("div");

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
        align-items: baseline;
        gap: 2px;
        padding: 4px 10px;

        cursor: default;
      }
      :host(:not(:first-child)) {
        border-left: 1px solid currentColor;
      }

      .label {
        font-size: 12px;
      }

      .shortcut-label {
        font-size: 10px;
        font-family: inherit;
      }
      .shortcut-label::before {
        content: "(";
      }
      .shortcut-label::after {
        content: ")";
      }

      .shortcut {
        font-family: inherit;
      }
      .shortcut + .shortcut {
        margin-left: 2px;
      }
    `;
    shadowRoot.appendChild(style);

    const label = document.createElement("span");
    label.className = "label";

    const slot = document.createElement("slot");

    label.appendChild(slot);
    shadowRoot.appendChild(label);

    this.#shortcutLabel.className = "shortcut-label";
    shadowRoot.appendChild(this.#shortcutLabel);

    this.#updateShortcutKey();

    this.addEventListener("click", this.#dispatchSelected);
  }

  attributeChangedCallback(
    name: string,
  ): void {
    switch (name) {
      case "attribute": {
        this.#updateShortcutKey();
        return;
      }
    }
  }

  connectedCallback() {
    if (!this.isConnected) {
      return;
    }

    self.addEventListener("keydown", this.#handleShortcut);
  }

  disconnectedCallback() {
    self.removeEventListener("keydown", this.#handleShortcut);
  }

  #updateShortcutKey = () => {
    this.#shortcutLabel.innerHTML = "";
    const attr = this.getAttribute("shortcut");
    if (!attr) {
      this.#shortcutKeys = [];
      return;
    }

    this.#shortcutKeys = parseAriaKeyshortcutsAttribute(attr);
    this.#shortcutKeys.forEach((shortcut) => {
      const keys = this.useMacOSKeys
        ? [
          shortcut.alt && kbd("⌥"),
          shortcut.shift && kbd("⇧"),
          shortcut.ctrl && kbd("⌃"),
          shortcut.meta && kbd("⌘"),
          kbd(keyToLabel(shortcut.key)),
        ]
        : [
          ...(shortcut.alt ? [kbd("Alt"), span("+")] : []),
          ...(shortcut.shift ? [kbd("Shift"), span("+")] : []),
          ...(shortcut.ctrl ? [kbd("Ctrl"), span("+")] : []),
          ...(shortcut.meta
            ? [kbd(this.useWindowsKeys ? "⊞ Win" : "Super"), span("+")]
            : []),
          kbd(keyToLabel(shortcut.key)),
        ];

      const container = document.createElement("kbd");

      keys.forEach((key) => {
        if (!key) {
          return;
        }

        container.appendChild(key);
      });

      this.#shortcutLabel.appendChild(container);
    });

    return;
  };

  #handleShortcut = (ev: KeyboardEvent): void => {
    if (
      !this.#shortcutKeys ||
      !this.#shortcutKeys.some((shortcut) => matchShortcutKey(ev, shortcut))
    ) {
      return;
    }

    ev.preventDefault();
    ev.stopPropagation();

    this.#dispatchSelected();
  };

  #dispatchSelected = () => {
    this.dispatchEvent(new CustomEvent("selected"));
  };
}
