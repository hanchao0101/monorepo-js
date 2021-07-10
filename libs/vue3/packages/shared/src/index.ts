export const isObject = (value: any) =>
  typeof value === "object" && value !== null;
export const extend = Object.assign;

export const isArray = Array.isArray;

export const isFunction = (value: any) => typeof value === "function";

export const isNumber = (value: any) => typeof value === "number";

export const isString = (value: any) => typeof value === "string";

export const isIntergerKey = (key: any) => parseInt(key) + "" === key;

export const hasOwn = (target: any, key: string) =>
  Object.prototype.hasOwnProperty.call(target, key);

export const hasChanged = (oldValue: any, value: any) => oldValue !== value;
