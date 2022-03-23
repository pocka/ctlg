export interface ShortcutKey {
  key: string;

  shift: boolean;
  alt: boolean;
  ctrl: boolean;
  meta: boolean;
}

/**
 * Parses a value of `aria-keyshortcuts` attribute then returns an array of `ShortcutKey` object.
 * Refer <https://www.w3.org/TR/wai-aria-1.1/#aria-keyshortcuts> for the syntax.
 *
 * @param value - a space-delimited list of keyboard shortcuts.
 * @returns Parsing result.
 */
export function parseAriaKeyshortcutsAttribute(
  value: string,
): readonly ShortcutKey[] {
  return value.split(" ").map((segment) => {
    if (!segment) {
      return null;
    }

    const base: ShortcutKey = {
      key: "",
      shift: false,
      alt: false,
      ctrl: false,
      meta: false,
    };

    for (const key of segment.split("+")) {
      // > Authors MUST ensure modifier keys come first when they are part of a keyboard shortcut.
      // > Authors MUST ensure that required non-modifier keys come last when they are part of a shortcut.
      // > The order of the modifier keys is not otherwise significant, so "Alt+Shift+T" and "Shift+Alt+T"
      // > are equivalent, but "T+Shift+Alt" is not valid because all of the modifier keys don't come first,
      // > and "Alt" is not valid because it doesn't include at least one non-modifier key.
      // From <https://www.w3.org/TR/wai-aria-1.1/#aria-keyshortcuts>
      if (base.key) {
        console.warn(
          segment +
            ' is not a valid keyboard shortcut syntax. The pattern of aria-keyshortcuts must be `(<modifier key> "+")+ <non-modifier key>`. Skipping.',
        );
        return null;
      }

      // The case-sensitivity of `aria-keyshortcuts` is not defined in the spec [^1]. However, the spec
      // states case-sensitivity about an alphabetic key and there is no lines about mentioning case-sensitivity
      // of `string` value ARIA attributes [^2], this function should not normalize an attribute value to
      // lowercase. MDN page [^3] states this attribute is case-insensitive but I can't find any reference.
      //
      // [^1]: https://www.w3.org/TR/wai-aria-1.1/#aria-keyshortcuts
      // [^2]: https://www.w3.org/TR/html-aria/#case-sensitivity
      // [^3]: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-keyshortcuts
      switch (key) {
        case "Shift":
          base.shift = true;
          break;
        case "Alt":
        case "AltGraph":
          base.alt = true;
          break;
        case "Control":
          base.ctrl = true;
          break;
        case "Meta":
          base.meta = true;
          break;
        case "Space":
          base.key = " ";
          break;
        case "Plus":
          base.key = "+";
          break;
        default:
          if (/^[a-z]$/i.test(key)) {
            base.key = key.toLowerCase();
          } else if (/^&#x[a-f0-9]+;$/i.test(key)) {
            const char = String.fromCodePoint(parseInt(key.slice(3, -1), 16));
            base.key = char;
          } else if (/^&#[\d]+;$/i.test(key)) {
            const char = String.fromCodePoint(parseInt(key.slice(2, -1), 10));
            base.key = char;
          } else {
            base.key = key;
          }
          break;
      }
    }

    if (!base.key) {
      console.warn(
        segment +
          " is not a valid keyboard shortcut syntax. The pattern MUST include exactly one non-modifier key. Skipping.",
      );
      return null;
    }

    return base;
  }).filter((k): k is ShortcutKey => !!k);
}

export function matchShortcutKey(
  ev: Pick<
    KeyboardEvent,
    "key" | "altKey" | "ctrlKey" | "shiftKey" | "metaKey" | "isComposing"
  >,
  shortcut: ShortcutKey,
): boolean {
  if (ev.isComposing) {
    return false;
  }

  if (shortcut.shift !== ev.shiftKey) {
    return false;
  }

  if (shortcut.alt !== ev.altKey) {
    return false;
  }

  if (shortcut.ctrl !== ev.ctrlKey) {
    return false;
  }

  if (shortcut.meta !== ev.metaKey) {
    return false;
  }

  return ev.key.toLowerCase() === shortcut.key;
}
