import { hasChanged, isArray, isObject } from "@vue/shared";
import { track, trigger } from "./effect";
import { TrackOpTypes, TriggerOpTypes } from "./operators";
import { reactive } from "./reactive";

export function ref(value) {
  return createRef(value);
}

export function shallowRef(value) {
  return createRef(value, true);
}
const convert = (val) => (isObject(val) ? reactive(val) : val);
class RefImpl {
  public _value;
  public __v_isRef = true;
  //参数前面增加修饰符，标识此树形放到了实例上
  constructor(public rawValue, public isShallow) {
    this._value = isShallow ? rawValue : convert(rawValue);
  }
  get value() {
    track(this, TrackOpTypes.GET, "value");
    return this._value;
  }

  set value(newValue) {
    if (hasChanged(this.rawValue, newValue)) {
      this.rawValue = newValue;
      this._value = this.isShallow ? newValue : convert(newValue);
      trigger(this, TriggerOpTypes.SET, "value", newValue);
    }
  }
}

function createRef(value, isShallow = false) {
  return new RefImpl(value, isShallow);
}

class ObjectRefImpl {
  public __v_isRef = true;
  constructor(public target, public key) {}
  get value() {
    return this.target[this.key];
  }

  set value(newValue) {
    this.target[this.key] = newValue;
  }
}
export function toRef(target, key) {
  return new ObjectRefImpl(target, key);
}

export function toRefs(object) {
  //object 可能是数组或对象
  const res = isArray(object) ? new Array(object.length) : {};
  for (const key in Object) {
    res[key] = toRef(object, key);
  }
}
