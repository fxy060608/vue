/* @flow */

import {
    isUndef
} from 'shared/util'

import {
    genClassStyleForVnode,
    updateElemStyle
} from 'weex/util/class'

import {
    genStylesheetForVnode
} from 'weex/util/stylesheet'

import {
    genClassForVnode
} from 'weex/util/class-list'

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

    const isWeexStyleCompiler = document.__$styleCompiler__ === 'weex'
    if (document.__$automator__ || !isWeexStyleCompiler) {
        if (!isWeexStyleCompiler) {
            // 改为在 Element 内解析 class
            vnode.elm.setStylesheet && vnode.elm.setStylesheet(genStylesheetForVnode(vnode))
        }
        const cls = genClassForVnode(vnode)
        vnode.elm.setClassList && vnode.elm.setClassList(cls.split(' '))
    }

    if (isWeexStyleCompiler) {
        updateElemStyle(
            vnode.elm,
            genClassStyleForVnode(vnode),
            genClassStyleForVnode(oldVnode),
            normalize
        )
    }
}

function normalize(name) { //class 已在编译阶段处理
    return name
}

export default {
    create: updateClass,
    update: updateClass
}
