/* @flow */

import {
  isUndef
} from 'shared/util'

import {
  observe
} from 'core/observer/index'

function findWxsProps(wxsProps, attrs) {
  const ret = {}
  Object.keys(wxsProps).forEach(name => {
    if (attrs[name]) {
      ret[wxsProps[name]] = attrs[name]
      delete attrs[name]
    }
  })
  return ret
}

function updateWxsProps(oldVnode: VNodeWithData, vnode: VNodeWithData) {
  if (
    isUndef(oldVnode.data.wxsProps) &&
    isUndef(vnode.data.wxsProps)
  ) {
    return
  }

  let oldWxsWatches = oldVnode.$wxsWatches
  const wxsPropsKey = Object.keys(vnode.data.wxsProps)
  if (!oldWxsWatches && !wxsPropsKey.length) {
    return
  }

  if (!oldWxsWatches) {
    oldWxsWatches = {}
  }

  const wxsProps = findWxsProps(vnode.data.wxsProps, vnode.data.attrs)
  const context = vnode.context

  vnode.$wxsWatches = {}

  Object.keys(wxsProps).forEach(prop => {
    // app-plus view wxs
    let watchProp = prop
    if (vnode.context.wxsProps) {
      watchProp = 'wxsProps.' + prop
    }

    vnode.$wxsWatches[prop] = oldWxsWatches[prop] || vnode.context.$watch(watchProp, function(newVal, oldVal) {
      wxsProps[prop](
        newVal,
        oldVal,
        context.$getComponentDescriptor(),
        vnode.elm.__vue__.$getComponentDescriptor()
      )
    })
  })

  Object.keys(oldWxsWatches).forEach(oldName => {
    if (!vnode.$wxsWatches[oldName]) {
      oldWxsWatches[oldName]()
      delete oldWxsWatches[oldName]
    }
  })
}

export default {
  create: updateWxsProps,
  update: updateWxsProps
}
