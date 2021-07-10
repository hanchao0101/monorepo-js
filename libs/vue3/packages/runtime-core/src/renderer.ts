import { createAppAPI } from "./apiCreateApp";

export function createRenderer(rendererOptions) {
  const render = (vnode, container) => {};
  return {
    createApp: createAppAPI(render),
  };
}
