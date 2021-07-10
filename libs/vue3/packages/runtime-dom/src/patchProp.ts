import { patchAttr } from "./modules/attr";
import { patchClass } from "./modules/class";
import { patchEvent } from "./modules/events";
import { patchStyle } from "./modules/style";

export const patchProp = (el, key, preValue, nextVlaue) => {
  switch (key) {
    case "class":
      patchClass(el, nextVlaue);
      break;
    case "style":
      patchStyle(el, preValue, nextVlaue);
      break;
    default:
      if (/^on[^a-z]/.test(key)) {
        patchEvent(el, key, nextVlaue);
      } else {
        patchAttr(el, key, nextVlaue);
      }
  }
};
