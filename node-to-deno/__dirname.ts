import makeloc from "https://deno.land/x/dirname/mod.ts";

interface IMeta {
  url: string;
  main: boolean;
}

export function __dirname(meta: IMeta) {
  return makeloc(meta).__dirname;
}
