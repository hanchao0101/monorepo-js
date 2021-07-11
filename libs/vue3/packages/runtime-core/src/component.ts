import { isArray, isFunction, isObject, ShapeFlags } from "@vue/shared";
import { publicInstanceProxyHandlers } from "./componentPucblicInstance";

export function createComponentInstance(vnode) {
  const instance = {
    vnode,
    type: vnode.type,
    props: {},
    attrs: {},
    slots: {},
    ctx: {},
    setupState: {},
    isMounted: false,
  };
  instance.ctx = { _: instance };
  return instance;
}

export function setupComponent(instance) {
  const { props, children, shapeFlag } = instance.vnode;
  instance.props = props; // initProps()
  instance.children = children; // initSlot()
  const isStateFul = shapeFlag & ShapeFlags.STATEFUL_COMPONENT;
  if (isStateFul) {
    //带状态的组件
    //调用 当前实例的setup方法，用setup方法返回值 填充 setupState和对应的render方法
    setupStatefulComponent(instance);
  }
}

function setupStatefulComponent(instance) {
  //代理
  instance.proxy = new Proxy(instance.ctx, publicInstanceProxyHandlers as any);

  const Component = instance.type;

  const { setup } = Component;

  const setupContext = createContext(instance);
  if (setup) {
    const setupResult = setup(instance.props, setupContext);
    handleSetupResult(instance, setupResult);
  } else {
    finishComponentSetup(instance);
  }

  //   Component.render(instance.ctx);
}

function handleSetupResult(instance, setupResult) {
  if (isFunction(setupResult)) {
    instance.render = setupResult;
  } else if (isObject(setupResult)) {
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
  const Component = instance.type;
  if (!instance.render) {
    if (!Component.render && Component.template) {
      //模板编译
    }
    instance.render = Component.render;
  }
  //vue2.0 api兼容
}

function createContext(instance) {
  return {
    attrs: instance.attrs,
    slots: instance.slots,
    emit: () => {},
    expose: () => {},
  };
}
