/* @flow */

import {
  isDef,
  isUndef
} from 'shared/util'

import {
  concat,
  stringifyClass,
  genClassForVnode
} from 'web/util/index'

function updateClass (oldVnode: any, vnode: any) {
  const el = vnode.elm
  const data: VNodeData = vnode.data
  const oldData: VNodeData = oldVnode.data
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    ) &&
    isUndef(el.__wxsAddClass) &&
    isUndef(el.__wxsRemoveClass) // fixed by xxxxxx __wxsClass
  ) {
    return
  }

  let cls = genClassForVnode(vnode)

  // handle transition classes
  const transitionClass = el._transitionClasses
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass))
  }

  // fixed by xxxxxx __wxsClass
  if(Array.isArray(el.__wxsRemoveClass) && el.__wxsRemoveClass.length){
    const clsArr = cls.split(/\s+/)
    el.__wxsRemoveClass.forEach(removeCls=>{
      const clsIndex = clsArr.findIndex(cls => cls === removeCls)
      if (clsIndex !== -1) {
        clsArr.splice(clsIndex, 1)
      }
    })
    cls = clsArr.join(' ')
    el.__wxsRemoveClass.length = 0
  }

  if (el.__wxsAddClass) {
    // 去重
    const clsArr = cls.split(/\s+/).concat(el.__wxsAddClass.split(/\s+/))
    const clsObj = Object.create(null)
    clsArr.forEach(cls => {
      cls && (clsObj[cls] = 1)
    })
    cls = Object.keys(clsObj).join(' ')
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls)
    el._prevClass = cls
  }
}

export default {
  create: updateClass,
  update: updateClass
}
