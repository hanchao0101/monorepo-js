export function createAppAPI(render) {
  return function (rootCompent, rootProps) {
    const app = {
      mount(container) {
        const vnode = {};
        render(vnode, container);
        //1.根据组件创建虚拟节点
        //2.将虚拟节点和容器获取到后调用render方法进行渲染
      },
    };
    return app;
  };
}
