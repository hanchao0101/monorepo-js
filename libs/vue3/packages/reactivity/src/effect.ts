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
