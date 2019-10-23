import {
  isUndef
} from 'shared/util'

function updateExtras(oldVnode, vnode) {

  const attrs = vnode.data.attrs

  if (isUndef(attrs)) {
    return
  }

  const id = attrs['_i']
  if (isUndef(id)) {
    return
  }

  const elm = vnode.elm
  const context = vnode.context
  // 存储事件标记
  elm.setAttribute('nid', id)
  elm.setAttribute('cid', context._$id)
}



export default {
  create: updateExtras,
  update: updateExtras
}
