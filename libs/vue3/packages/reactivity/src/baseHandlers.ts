import {
  extend,
  hasChanged,
  hasOwn,
  isArray,
  isIntergerKey,
  isObject,
} from "@vue/shared";
import { track, trigger } from "./effect";
import { TrackOpTypes, TriggerOpTypes } from "./operators";
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
  return function set(target: any, key: string, value: any, reaceiver: any) {
    const oldValue = target[key];
    const hadKey =
      isArray(target) && isIntergerKey(key) //根据索引操作数组
        ? Number(key) < target.length //数组新增
        : hasOwn(target, key);
    const result = Reflect.set(target, key, value, reaceiver);

    if (!hadKey) {
      //新增
      trigger(target, TriggerOpTypes.ADD, key, value);
    } else if (hasChanged(oldValue, value)) {
      //修改
      trigger(target, TriggerOpTypes.SET, key, value, oldValue);
    }
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
