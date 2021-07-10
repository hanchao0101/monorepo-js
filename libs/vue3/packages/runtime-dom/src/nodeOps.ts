export const nodeOps = {
  createElement: (tagName) => document.createElement(tagName),
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.remoceChild(child);
    }
  },
  insert: (child, parent, anchor = null) => {
    parent.insertBefore(child, anchor); //如果参照物为空，则相当于appendChild
  },
  querySelector: (selector) => document.querySelector(selector),
  setElementText: (el, text) => (el.textContent = text),
  createText: (text) => document.createTextNode(text),
  setText: (node, text) => (node.nodeValue = text),
};
