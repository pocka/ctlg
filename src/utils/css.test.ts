import { assertEquals } from "../testing/assert.ts";
import { css } from "./css.ts";

Deno.test("Do not touch input string", () => {
  const className = "foo";
  const colour = "tomato";

  // prettier-ignore
  assertEquals(css`.${className} { background: ${colour}; }`, ".foo { background: tomato; }");
});
