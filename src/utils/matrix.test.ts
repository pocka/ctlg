import { assertEquals, assertArrayIncludes } from "../testing/assert.ts";
import { enumerate, Instance } from "./matrix.ts";

Deno.test("Enumerate single field matrix", () => {
  const input = {
    foo: [0, 1, 2, 3],
  };

  const expected: Instance<typeof input>[] = [
    { foo: 0 },
    { foo: 1 },
    { foo: 2 },
    { foo: 3 },
  ];

  assertEquals(enumerate(input), expected);
});

Deno.test("Enumerate multiple fields matrix", () => {
  const input = {
    age: [2, 3],
    kind: ["dog", "cat"],
    hasOwner: [true, false, null],
  };

  const expected: Instance<typeof input>[] = [
    { age: 2, kind: "dog", hasOwner: true },
    { age: 2, kind: "dog", hasOwner: false },
    { age: 2, kind: "dog", hasOwner: null },
    { age: 3, kind: "dog", hasOwner: true },
    { age: 3, kind: "dog", hasOwner: false },
    { age: 3, kind: "dog", hasOwner: null },
    { age: 2, kind: "cat", hasOwner: true },
    { age: 2, kind: "cat", hasOwner: false },
    { age: 2, kind: "cat", hasOwner: null },
    { age: 3, kind: "cat", hasOwner: true },
    { age: 3, kind: "cat", hasOwner: false },
    { age: 3, kind: "cat", hasOwner: null },
  ];

  const actual = enumerate(input);
  assertArrayIncludes(actual, expected);
  assertEquals(actual.length, expected.length);
});
