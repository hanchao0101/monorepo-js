export const patchStyle = (el, pre, next) => {
  const style = el.style;
  if (next === null) {
    el.removeAttribute("style");
  }
  //老的有，新的没有，需要删除
  for (let key in pre) {
    if (!next[key]) {
      style[key] = "";
    }
  }

  //新的里面需要赋值到style上
  for (let key in next) {
    style[key] = next[key];
  }
};
