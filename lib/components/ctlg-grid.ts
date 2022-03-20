export class CtlgGrid extends HTMLElement {
  static defaultTagName = "ctlg-grid" as const;

  static define(tagName: string = this.defaultTagName): void {
    if (!customElements.get(tagName)) {
      customElements.define(tagName, this);
    }
  }

  constructor() {
    super();
  }
}
