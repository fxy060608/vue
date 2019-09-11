/* @flow */

import { addAttr } from 'compiler/helpers'

export function postTransformRef (el: ASTElement) {
  if (el.ref) {
    addAttr(el, 'ref', el.ref)
    delete el.ref
  }
}
