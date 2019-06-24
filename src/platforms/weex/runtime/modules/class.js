/* @flow */

import {
    isUndef
} from 'shared/util'

import {
    genClassStyleForVnode,
    updateElemStyle
} from 'weex/util/class'

function updateClass(oldVnode: VNodeWithData, vnode: VNodeWithData) {
    const data: VNodeData = vnode.data
    const oldData: VNodeData = oldVnode.data
    if (
        isUndef(data.staticClass) &&
        isUndef(data.class) && (
            isUndef(oldData) || (
                isUndef(oldData.staticClass) &&
                isUndef(oldData.class)
            )
        )
    ) {
        return
    }

    updateElemStyle(
        vnode.elm,
        genClassStyleForVnode(vnode),
        genClassStyleForVnode(oldVnode),
        normalize
    )
}

function normalize(name) { //class 已在编译阶段处理
    return name
}

export default {
    create: updateClass,
    update: updateClass
}
