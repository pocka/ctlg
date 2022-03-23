import { assertEquals } from "../testing/assert.ts";
import {
  matchShortcutKey,
  parseAriaKeyshortcutsAttribute,
  ShortcutKey,
} from "./shortcut_key.ts";

const blankShortcut: ShortcutKey = {
  key: "",
  ctrl: false,
  shift: false,
  alt: false,
  meta: false,
};

const blankEvent: Parameters<typeof matchShortcutKey>[0] = {
  key: "",
  altKey: false,
  shiftKey: false,
  ctrlKey: false,
  metaKey: false,
  isComposing: false,
};

Deno.test("Parse single shortcut key", () => {
  const expected: readonly ShortcutKey[] = [{
    ...blankShortcut,
    key: "c",
  }];

  assertEquals(parseAriaKeyshortcutsAttribute("c"), expected);
});

Deno.test("Parse multiple shortcut keys", () => {
  const expected: readonly ShortcutKey[] = [
    {
      ...blankShortcut,
      key: "a",
    },
    {
      ...blankShortcut,
      shift: true,
      key: "b",
    },
  ];

  assertEquals(parseAriaKeyshortcutsAttribute("a Shift+b"), expected);
});

Deno.test("Parse `Plus` and `Space`", () => {
  const expected: readonly ShortcutKey[] = [
    {
      ...blankShortcut,
      key: " ",
    },
    {
      ...blankShortcut,
      key: "+",
    },
  ];

  assertEquals(parseAriaKeyshortcutsAttribute("Space Plus"), expected);
});

Deno.test("Parse modifier keys", () => {
  const base: ShortcutKey = {
    ...blankShortcut,
    key: "a",
  };

  assertEquals(parseAriaKeyshortcutsAttribute("Shift+a"), [{
    ...base,
    shift: true,
  }]);
  assertEquals(parseAriaKeyshortcutsAttribute("Alt+a"), [{
    ...base,
    alt: true,
  }]);
  assertEquals(parseAriaKeyshortcutsAttribute("Control+a"), [{
    ...base,
    ctrl: true,
  }]);
  assertEquals(parseAriaKeyshortcutsAttribute("Meta+A"), [{
    ...base,
    meta: true,
  }]);
});

Deno.test("Parse HTML escaped characters", () => {
  assertEquals(parseAriaKeyshortcutsAttribute("Shift+&#39;"), [
    { ...blankShortcut, key: "'", shift: true },
  ]);
});

Deno.test("Should not parse incorrect syntax", () => {
  assertEquals(parseAriaKeyshortcutsAttribute("shift+a"), []);
  assertEquals(parseAriaKeyshortcutsAttribute("Shift + a"), [{
    ...blankShortcut,
    key: "a",
  }]);
  assertEquals(parseAriaKeyshortcutsAttribute("A+B"), []);
  assertEquals(parseAriaKeyshortcutsAttribute("T+Shift+Alt"), []);
});

Deno.test("Always return false if IME is active", () => {
  const ev: Parameters<typeof matchShortcutKey>[0] = {
    ...blankEvent,
    key: "a",
    isComposing: true,
  };

  const shortcut: ShortcutKey = {
    ...blankShortcut,
    key: "a",
  };

  assertEquals(matchShortcutKey(ev, shortcut), false);
});

Deno.test("Check whether a shortcut key matches KeyboardEvent", () => {
  assertEquals(
    matchShortcutKey({
      ...blankEvent,
      key: "a",
    }, {
      ...blankShortcut,
      key: "a",
    }),
    true,
  );

  assertEquals(
    matchShortcutKey({ ...blankEvent, key: "a" }, {
      ...blankShortcut,
      key: "b",
    }),
    false,
  );
});

Deno.test("Match key in case-insensitive way", () => {
  assertEquals(
    matchShortcutKey({ ...blankEvent, key: "A" }, {
      ...blankShortcut,
      key: "a",
    }),
    true,
  );
});

Deno.test("Check shift key", () => {
  assertEquals(
    matchShortcutKey(
      { ...blankEvent, key: "a", shiftKey: true },
      { ...blankShortcut, key: "a", shift: true },
    ),
    true,
  );
});

Deno.test("Check ctrl key", () => {
  assertEquals(
    matchShortcutKey(
      { ...blankEvent, key: "a", ctrlKey: true },
      { ...blankShortcut, key: "a", ctrl: true },
    ),
    true,
  );
});

Deno.test("Check alt key", () => {
  assertEquals(
    matchShortcutKey(
      { ...blankEvent, key: "a", altKey: true },
      { ...blankShortcut, key: "a", alt: true },
    ),
    true,
  );
});

Deno.test("Check meta key", () => {
  assertEquals(
    matchShortcutKey(
      { ...blankEvent, key: "a", metaKey: true },
      { ...blankShortcut, key: "a", meta: true },
    ),
    true,
  );
});

Deno.test("Check modifier keys combination", () => {
  assertEquals(
    matchShortcutKey({ ...blankEvent, key: "a", ctrlKey: true, altKey: true }, {
      ...blankShortcut,
      key: "a",
      ctrl: true,
      alt: true,
    }),
    true,
  );

  assertEquals(
    matchShortcutKey(
      { ...blankEvent, key: "a", ctrlKey: true, metaKey: true },
      {
        ...blankShortcut,
        meta: true,
      },
    ),
    false,
  );
});
