/* @flow */

import {
    extend
} from 'shared/util'

import {
    normalizeStyleBinding
} from 'web/util/style'

const TAGS = {
    'view': {
        'class': ['hoverClass'],
        'style': []
    },
    'button': {
        'class': ['hoverClass'],
        'style': []
    },
    'navigator': {
        'class': ['hoverClass'],
        'style': []
    },
    'u-input': {
        'class': ['placeholderClass'],
        'style': ['placeholderStyle']
    },
    'u-textarea': {
        'class': ['placeholderClass'],
        'style': ['placeholderStyle']
    },
    'picker-view': {
        'class': ['indicatorClass', 'maskClass'],
        'style': ['indicatorStyle', 'maskStyle']
    }
}

function normalizeAttr(key, val, el, ctx) {
    if (!val) {
        return val
    }
    const opts = TAGS[el.type]
    if (opts) {
        if (opts['class'].indexOf(key) !== -1) {
            return ctx.$options.style && ctx.$options.style[val] || {}
        }
        if (opts['style'].indexOf(key) !== -1) {
            return normalizeStyleBinding(val)
        }
    }
    return val
}

function normalizeAttrs(attrs, el, ctx) {
    const opts = TAGS[el.type]
    if (!opts) {
        return attrs
    }
    const stylesheet = ctx.$options.style || {}
    Object.keys(attrs).forEach(key => {
        const val = attrs[key]
        if (opts['class'].indexOf(key) !== -1) {
            attrs[key] = stylesheet[val] || {}
        } else if (opts['style'].indexOf(key) !== -1) {
            attrs[key] = normalizeStyleBinding(val)
        }
    })
    return attrs
}

function updateAttrs(oldVnode: VNodeWithData, vnode: VNodeWithData) {
    if (!oldVnode.data.attrs && !vnode.data.attrs) {
        return
    }
    let key, cur, old
    const elm = vnode.elm
    const oldAttrs = oldVnode.data.attrs || {}
    let attrs = vnode.data.attrs || {}
    // clone observed objects, as the user probably wants to mutate it
    if (attrs.__ob__) {
        attrs = vnode.data.attrs = extend({}, attrs)
    }

    const supportBatchUpdate = typeof elm.setAttrs === 'function'
    const batchedAttrs = {}
    for (key in attrs) {
        cur = attrs[key]
        old = oldAttrs[key]
        if (old !== cur) {
            supportBatchUpdate
                ?
                (batchedAttrs[key] = cur) :
                elm.setAttr(key, normalizeAttr(key, cur, elm, vnode.context))
        }
    }
    for (key in oldAttrs) {
        if (attrs[key] == null) {
            supportBatchUpdate
                ?
                (batchedAttrs[key] = undefined) :
                elm.setAttr(key)
        }
    }
    if (supportBatchUpdate) {
        elm.setAttrs(normalizeAttrs(batchedAttrs, elm, vnode.context))
    }
}

export default {
    create: updateAttrs,
    update: updateAttrs
}
