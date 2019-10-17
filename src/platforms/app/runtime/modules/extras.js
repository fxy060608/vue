import {
  isUndef
} from 'shared/util'

import {
  stringifyClass
} from 'web/util/class'

import {
  normalizeStyleBinding
} from 'web/util/style'

function updateExtras(oldVnode, vnode) {

  const attrs = vnode.data.attrs
  const extras = vnode.data.extras

  const isExtrasUndef = isUndef(extras)
  if (isExtrasUndef && isUndef(attrs)) {
    return
  }

  const elm = vnode.elm
  const context = vnode.context

  const id = attrs['_i']
  // 存储事件标记
  elm.setAttribute('nid', String(id))
  elm.setAttribute('cid', context._$id)

  if (
    (
      isExtrasUndef ||
      Object.keys(extras).length === 0
    ) &&
    Object.keys(attrs).length === 1
  ) {
    return
  }

  const $s = vnode.context._$s.bind(vnode.context)

  if (extras) {
    if (extras['c']) {
      extras['c'] = stringifyClass(extras['c'])
    }
    if (extras['s']) {
      extras['s'] = normalizeStyleBinding(extras['s'])
    }
    for (let key in extras) {
      $s(id, key, extras[key])
    }
  }

  if (attrs) {
    for (let key in attrs) {
      key !== '_i' && $s(id, 'a-' + key, attrs[key])
    }
  }

}



export default {
  create: updateExtras,
  update: updateExtras
}
