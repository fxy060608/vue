/* @flow */

import {
    isDef,
    isUndef,
    isObject,
    extend
} from 'shared/util'

export function genClassStyleForVnode(vnode: VNodeWithData) {
    let style = getClassStyleForVnode(vnode)
    let parentNode = vnode
    let childNode = vnode
    while (isDef(childNode.componentInstance)) {
        childNode = childNode.componentInstance._vnode
        if (childNode && childNode.data) {
            style = extend(getClassStyleForVnode(childNode), style)
        }
    }
    while (isDef(parentNode = parentNode.parent)) {
        if (parentNode && parentNode.data) {
            style = extend(style, getClassStyleForVnode(parentNode))
        }
    }
    return style
}

function getClassStyleForVnode(vnode: VNodeWithData) {
    const data: VNodeData = vnode.data
    if (
        isUndef(data.staticClass) &&
        isUndef(data.class)
    ) {
        return {}
    }

    return getStyle(makeClassList(data), vnode.context)
}

function getStyle(classList, ctx: Component) {
    const stylesheet: any = ctx.$options.style || {}
    const result = {}
    classList.forEach(name => {
        const style = stylesheet[name]
        extend(result, style)
    })
    return result
}

function makeClassList(data: VNodeData) {
    const classList = []
    // unlike web, weex vnode staticClass is an Array
    const staticClass: any = data.staticClass
    const dataClass = data.class
    if (staticClass) {
        classList.push.apply(classList, staticClass)
    }
    if (Array.isArray(dataClass)) {
        classList.push.apply(classList, dataClass)
    } else if (isObject(dataClass)) {
        classList.push.apply(classList, Object.keys(dataClass).filter(className => dataClass[className]))
    } else if (typeof dataClass === 'string') {
        classList.push.apply(classList, dataClass.trim().split(/\s+/))
    }

    return classList
}

export function updateElemStyle(el, newStyle, oldStyle, normalize) {
    let cur, name
    const batchedStyles = {}

    for (name in oldStyle) {
        if (isUndef(newStyle[name])) {
            batchedStyles[normalize(name)] = ''
        }
    }
    for (name in newStyle) {
        cur = newStyle[name]
        if (cur !== oldStyle[name]) {
            batchedStyles[normalize(name)] = cur
        }
    }
    el.setStyles(batchedStyles)
}
