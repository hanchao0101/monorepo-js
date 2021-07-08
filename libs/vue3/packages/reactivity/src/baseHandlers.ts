import { extend, isObject } from "@vue/shared";
import { track } from "./effect";
import { TrackOpTypes } from "./operators";
import { reactive, readonly } from "./reactive";

function createGetter(isReadonly = false, isShallow = false) {
  return function get(target: Object, key: string, reaceiver: any): any {
    const res = Reflect.get(target, key, reaceiver);
    if (!isReadonly) {
      //TODO 收集依赖

      track(target, TrackOpTypes.GET, key);
    }
    if (isShallow) return res;

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }
    return res;
  };
}
function createSetter(isShallow = false) {
  return function set(target: Object, key: string, value: any, reaceiver: any) {
    const result = Reflect.set(target, key, value, reaceiver);
    return result;
  };
}
const get = createGetter(false, false);
const shallowReactiveGet = createGetter(false, true);
const shallowReadonlyGet = createGetter(true, true);
const readonlyGet = createGetter(true, false);

const set = createSetter();
const shallowReactiveSet = createSetter(true);
const readonlySet = {
  set: () => {
    console.warn("readonly value can not set value");
  },
};
export const mutableHandler = {
  get,
  set,
};
export const shallowReactiveHandler = {
  get: shallowReactiveGet,
  set: shallowReactiveSet,
};
export const shallowReadonlyHandler = extend(
  {
    get: shallowReadonlyGet,
  },
  readonlySet
);
export const readonlyHandler = extend(
  {
    get: readonlyGet,
  },
  readonlySet
);
