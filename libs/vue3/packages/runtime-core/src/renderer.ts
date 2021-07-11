import { effect } from "@vue/reactivity";
import { ShapeFlags } from "@vue/shared";
import { createAppAPI } from "./apiCreateApp";
import { createComponentInstance, setupComponent } from "./component";
import { queueJob } from "./scheduler";
import { normalizeVNode, Text } from "./vnode";

export function createRenderer(rendererOptions) {
  const {
    createElement: hostCreateElement,
    remove: hostRemove,
    insert: hostInsert,
    querySelector: hostQuerySelector,
    setElementText: hostSetElementText,
    createText: hostCreateText,
    setText: hostSetText,
    patchProp: hostPatchProp,
  } = rendererOptions;

  //------------------组件---------------------
  const setupRenderEffect = (instance, container) => {
    effect(
      function componentEffect() {
        if (!instance.isMounted) {
          const proxyToUse = instance.proxy;
          const subTree = (instance.subTree = instance.render.call(
            proxyToUse,
            proxyToUse
          ));
          patch(null, subTree, container);
          instance.isMounted = true;
        } else {
        }
      },
      {
        scheduler: queueJob,
      }
    );
    instance.render();
  };

  const mountComponnent = (initialVNode, container) => {
    //1.先有实例
    const instance = (initialVNode.component =
      createComponentInstance(initialVNode));
    //2.需要的数据解析到实例上
    setupComponent(instance);
    //3.创建effect 让render函数执行
    setupRenderEffect(instance, container);
  };

  const processComponent = (n1, n2, container) => {
    if (n1 == null) {
      mountComponnent(n2, container);
    }
  };
  //------------------组件---------------------

  //------------------元素---------------------
  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      const child = normalizeVNode(children[i]);
      patch(null, child, container);
    }
  };

  const mountElement = (vnode, container) => {
    const { props, shapeFlag, type, children } = vnode;
    const el = (vnode.el = hostCreateElement(type));
    if (props) {
      for (const key in props) {
        hostPatchProp(el, key, null, props[key]);
      }
    }
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, children);
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el);
    }
    hostInsert(el, container);
  };
  const processElement = (n1, n2, container) => {
    if (n1 == null) {
      mountElement(n2, container);
    } else {
      //更新
    }
  };
  const processText = (n1, n2, container) => {
    if (n1 == null) {
      hostInsert((n2.el = hostCreateText(n2.children)), container);
    }
  };
  const patch = (n1, n2, container) => {
    const { shapeFlag, type } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container);
        }
    }
  };

  const render = (vnode, container) => {
    patch(null, vnode, container);
  };
  return {
    createApp: createAppAPI(render),
  };
}
