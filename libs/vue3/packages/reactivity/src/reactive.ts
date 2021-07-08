import { isObject } from "@vue/shared";
import {
  mutableHandler,
  shallowReactiveHandler,
  shallowReadonlyHandler,
  readonlyHandler,
} from "./baseHandlers";

const reactiveMap = new WeakMap();
const readonlyMap = new WeakMap();
function createReactiveObject(
  target: Object,
  isReadonly: boolean,
  baseHandler: Object
) {
  if (!isObject(target)) {
    return target;
  }
  const proxyMap = isReadonly ? readonlyMap : reactiveMap;

  const existProxy = proxyMap.get(target);

  if (existProxy) return existProxy;

  const proxy = new Proxy(target, baseHandler);

  proxyMap.set(target, proxy);

  return proxy;
}

function reactive(target: Object) {
  return createReactiveObject(target, false, mutableHandler);
}
function shallowReactive(target: Object) {
  return createReactiveObject(target, false, shallowReactiveHandler);
}
function shallowReadonly(target: Object) {
  return createReactiveObject(target, true, shallowReadonlyHandler);
}
function readonly(target: Object) {
  return createReactiveObject(target, true, readonlyHandler);
}
export { reactive, shallowReactive, shallowReadonly, readonly };
