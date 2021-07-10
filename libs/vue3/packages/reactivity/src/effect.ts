import { isArray, isIntergerKey } from "@vue/shared";
import { TriggerOpTypes } from "./operators";

let uid = 0;
let activeEffect: any;
const effectStack: any = []; //嵌套effect,保证顺序正确
// effect(() => {
//   effect(() => {});
// });
function createReactiveEffect(fn: Function, options: any = {}) {
  const effect: any = function reactiveEffect() {
    if (!effectStack.includes(effect)) {
      try {
        effectStack.push(effect);
        activeEffect = effect;
        return fn();
      } finally {
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  };
  effect.id = uid;
  effect._isEffect = true;
  effect.raw = fn;
  effect.options = options;
  return effect;
}
export function effect(fn: Function, options: any = {}) {
  const effect = createReactiveEffect(fn, options);
  if (!options.lazy) effect();
  return effect;
}

const targetMap = new WeakMap();
export function track(target: any, type: number, key: string) {
  if (!activeEffect === undefined) {
    //属性不在effect中，不用收集
    return;
  }
  //依赖收集
  //WeakMap
  //WeakMap-key:target
  //WeakMap-value:Map
  //Map-key:key
  //Map-value:Set
  //Set:[effect]
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
  }
}

export function trigger(target, type, key?, newValue?, oldValue?) {
  console.log(target, type, key, newValue, oldValue);
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const effects = new Set();
  const add = (effectsToAdd) => {
    if (effectsToAdd) {
      effectsToAdd.forEach((effect) => effects.add(effect));
    }
  };
  //修改数组的长度
  if (isArray(target) && key === "length") {
    depsMap.forEach((dep, key) => {
      //arr.length = 1 修改的长度小于之前的长度
      if (key === "length" || key > newValue) {
      }
      add(dep);
    });
  } else {
    //对象
    if (key !== undefined) {
      add(depsMap.get(key));
    }
    //修改数组中的某一索引
    switch (type) {
      case TriggerOpTypes.ADD: //如果添加索引就触发长度更新
        if (isArray(target) && isIntergerKey(key)) {
          add(depsMap.get("length"));
        }
    }
  }
  effects.forEach((effect: any) => {
    console.log(3334567, effect);
    if (effect && effect.options.scheduler) {
      effect.options.scheduler(effect);
    } else {
      effect && effect();
    }
  });
}
