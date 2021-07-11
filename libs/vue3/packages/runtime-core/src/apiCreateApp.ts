import { createVNode } from "./vnode";

export function createAppAPI(render) {
  return function (rootComponent, rootProps) {
    const app = {
      _props: rootProps,
      _component: rootComponent,
      _container: null,
      mount(container) {
        // const vnode = {};
        // render(vnode, container);
        //1.根据组件创建虚拟节点
        const vnode = createVNode(rootComponent, rootProps);
        //2.将虚拟节点和容器获取到后调用render方法进行渲染
        render(vnode, container);
        app._container = container;
      },
    };
    return app;
  };
}
