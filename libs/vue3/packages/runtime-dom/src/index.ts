import { extend } from "@vue/shared";
import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";
import { createRenderer } from "@vue/runtime-core";

const rendererOptions = extend({ patchProp }, nodeOps);

export { rendererOptions };

export function createApp(rootCompent, rootProps = null) {
  const app: any = createRenderer(rendererOptions).createApp(
    rootCompent,
    rootProps
  );
  const { mount } = app;
  app.mount = function (container) {
    container = document.querySelector(container);
    container.innerHTML = "";
    mount(container);
  };
  return app;
}

export * from "@vue/runtime-core";
