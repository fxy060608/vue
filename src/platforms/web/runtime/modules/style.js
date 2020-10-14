/* @flow */

import { getStyle, normalizeStyleBinding } from 'web/util/style'
import { cached, camelize, extend, isDef, isUndef, hyphenate } from 'shared/util'

const cssVarRE = /^--/
const importantRE = /\s*!important$/

// upx,rpx 正则匹配
const unitRE = /\b([+-]?\d+(\.\d+)?)[r|u]px\b/g

const transformUnit = (val) => {
  if (typeof val === 'string') {
    return val.replace(unitRE, (a, b) => {
      /* eslint-disable no-undef */
      return uni.upx2px(b) + 'px'
    })
  }
  return val
}

const urlRE1 = /url\(\s*['"](.+?\.(jpg|gif|png))['"]\s*\)/
const urlRE2 = /url\(\s*([a-zA-Z0-9\.\-\_\/]+?\.(jpg|gif|png))\s*\)/

const transformUrl = (val, ctx) => {
  if (typeof val === 'string' && val.indexOf('url(') !== -1) {
    const matches = val.match(urlRE1) || val.match(urlRE2)
    if (matches && matches.length === 3) {
        val = val.replace(matches[1], ctx._$getRealPath(matches[1]))
    }
  }
  return val
}

const setProp = (el, name, val, ctx) => {
  if(ctx && ctx._$getRealPath && val){
    val = transformUrl(val, ctx)
  }
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val)
  } else if (importantRE.test(val)) {
    el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important')
  } else {
    const normalizedName = normalize(name)
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (let i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = transformUnit(val[i])
      }
    } else {
      el.style[normalizedName] = transformUnit(val)
    }
  }
}

const vendorNames = ['Webkit', 'Moz', 'ms']

let emptyStyle
const normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style
  prop = camelize(prop)
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  const capName = prop.charAt(0).toUpperCase() + prop.slice(1)
  for (let i = 0; i < vendorNames.length; i++) {
    const name = vendorNames[i] + capName
    if (name in emptyStyle) {
      return name
    }
  }
})

function updateStyle (oldVnode: VNodeWithData, vnode: VNodeWithData) {
  const data = vnode.data
  const oldData = oldVnode.data
  const el: any = vnode.elm
  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style) &&
    isUndef(el.__wxsStyle) // fixed by xxxxxx __wxsStyle
  ) {
    return
  }

  let cur, name

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

  const newStyle = getStyle(vnode, true)

  // fixed by xxxxxx __wxsStyle
  if(el.__wxsStyle){
    Object.assign(vnode.data.normalizedStyle, el.__wxsStyle)
    Object.assign(newStyle, el.__wxsStyle)
  }

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '')
    }
  }
  for (name in newStyle) {
    cur = newStyle[name]
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur, vnode.context)
    }
  }
}

export default {
  create: updateStyle,
  update: updateStyle
}
