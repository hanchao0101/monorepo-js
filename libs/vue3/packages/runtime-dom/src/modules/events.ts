export const patchEvent = (el, key, value) => {
  //缓存
  const invokers = el._vei || (el._vei = {});
  const exists = invokers[key];
  if (value && exists) {
    exists.value = value;
  } else {
    const eventName = key.slice(2).toLowerCase();
    if (value) {
      const invoker = (invokers[key] = createInvoker(value));
      el.addEventListener(eventName, invoker);
    } else {
      //以前绑定了，但是当时没有value
      el.removeEventListener(eventName, exists);
      invokers[key] = undefined;
    }
  }
};

function createInvoker(value) {
  const invoker = (e) => {
    invoker.value(e);
  };
  invoker.value = value;
  return invoker;
}
