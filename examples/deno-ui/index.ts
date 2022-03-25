import axe from "https://cdn.skypack.dev/axe-core@4.4.1?dts";

import { CtlgMenubar, CtlgMenubarItem } from "../../mod.ts";

CtlgMenubar.define();
CtlgMenubarItem.define();

// Run a11y tests
requestAnimationFrame(() => {
  axe.configure({
    rules: [
      {
        // I don't think this rule is applicable for desktop-like applications.
        // At least this application doesn't/cannot have headings and it's hard to
        // markup well semantically with the current HTML spec.
        // <https://dequeuniversity.com/rules/axe/4.1/page-has-heading-one>
        id: "page-has-heading-one",
        enabled: false,
      },
    ],
  });

  axe.run().then((results) => {
    console.dir(results);
  }).catch((err) => {
    console.error("Failed to run axe", err);
  });
});
