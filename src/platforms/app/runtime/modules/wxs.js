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
      immediate: true, // 当 prop 的值被设置 WXS 函数就会触发，而不只是值发生改变，所以在页面初始化的时候会调用一次 WxsPropObserver 的函数
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
