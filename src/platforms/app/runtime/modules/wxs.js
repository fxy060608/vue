/* @flow */

import {
  isUndef
} from 'shared/util'

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

  const wxsProps = vnode.data.wxsProps

  vnode.$wxsWatches = {}

  Object.keys(wxsProps).forEach(prop => {
    const watchProp = wxsProps[prop]

    vnode.$wxsWatches[prop] = oldWxsWatches[prop] || vnode.context.$watch(watchProp, function() {
      this.$forceUpdate()
    }, {
      deep: true
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
