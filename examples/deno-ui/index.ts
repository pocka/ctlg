import { CtlgMenubar, CtlgMenubarItem } from "../../mod.ts";

CtlgMenubar.define();
CtlgMenubarItem.define();

document.getElementById("item1")?.addEventListener("selected", (ev) => {
  console.log(ev);
});

document.getElementById("item2")?.addEventListener("selected", (ev) => {
  console.log(ev);
});
