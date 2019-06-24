/* @flow */
import { getStyle, normalizeStyleBinding } from 'web/util/style'
import { extend, cached, camelize, isDef, isUndef } from 'shared/util'

import { updateElemStyle } from 'weex/util/class'

const normalize = cached(camelize)

function updateStyle (oldVnode: VNodeWithData, vnode: VNodeWithData) {
  const data = vnode.data
  const oldData = oldVnode.data

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  const el: any = vnode.elm
  const oldStaticStyle: any = oldData.staticStyle
  const oldStyleBinding: any = oldData.normalizedStyle || oldData.style || {}

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  const oldStyle = oldStaticStyle || oldStyleBinding

  const style = normalizeStyleBinding(vnode.data.style) || {}

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style

  updateElemStyle(
      el, 
      getStyle(vnode, true), 
      oldStyle,
      normalize
  )
}

export default {
  create: updateStyle,
  update: updateStyle
}
