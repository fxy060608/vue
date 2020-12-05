/* @flow */

import {
  isDef
} from 'shared/util'

export function genStylesheetForVnode (vnode: VNode) {
  let stylesheet = []
  let parentNode = vnode
  let childNode = vnode
  getStylesheetForVnode(stylesheet, vnode)
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode
    getStylesheetForVnode(stylesheet, childNode)
  }
  while (isDef(parentNode = parentNode.parent)) {
    getStylesheetForVnode(stylesheet, parentNode, true)
  }
  return stylesheet
}

function getStylesheetForVnode (stylesheet: Array<any>, vnode: VNode, unshift?: boolean) {
  const style: any = vnode && vnode.context.$options.style
  if (style && !stylesheet.includes(style)) {
    if (unshift) {
      stylesheet.unshift(style)
    } else {
      stylesheet.push(style)
    }
  }
}