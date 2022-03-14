import { foo } from "./foo.ts";

export const bar = (): number => foo;

console.log(foo);
