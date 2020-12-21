import {viewEngine,engineFactory,adapterFactory} from "https://deno.land/x/view_engine/mod.ts";

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();

export function viewsMiddleware(option: object = {}) {
  return viewEngine(oakAdapter,ejsEngine, option);
}