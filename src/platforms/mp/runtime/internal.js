/* @flow */

import {
    extend,
    hyphenate,
    isPlainObject
} from 'shared/util'

import {
    pushTarget,
    popTarget
} from 'core/observer/dep'

import {
    initProvide,
    initInjections
} from 'core/instance/inject'

import {
    toArray,
    invokeWithErrorHandling
} from 'core/util/index'

import {
    renderClass
} from 'web/util/class'

import {
    normalizeStyleBinding
} from 'web/util/style'

import {
    nextTick
} from './next-tick'

const MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent']

function getTarget(obj, path) {
    const parts = path.split('.')
    let key = parts[0]
    if (key.indexOf('__$n') === 0) { //number index
        key = parseInt(key.replace('__$n', ''))
    }
    if (parts.length === 1) {
        return obj[key]
    }
    return getTarget(obj[key], parts.slice(1).join('.'))
}

export function internalMixin(Vue: Class<Component>) {

    const oldEmit = Vue.prototype.$emit

    Vue.prototype.$emit = function(event: string): Component {
        if (this.$mp && event) {
            this.$mp[this.mpType]['triggerEvent'](event, {
                __args__: toArray(arguments, 1)
            })
        }
        return oldEmit.apply(this, arguments)
    }
    
    Vue.prototype.$nextTick = function (fn: Function) {
      return nextTick(this, fn)
    }

    MP_METHODS.forEach(method => {
        Vue.prototype[method] = function(args) {
            if (this.$mp) {
                return this.$mp[this.mpType][method](args)
            }
        }
    })

    Vue.prototype.__init_provide = initProvide

    Vue.prototype.__init_injections = initInjections

    Vue.prototype.__call_hook = function(hook, args) {
        const vm = this
        // #7573 disable dep collection when invoking lifecycle hooks
        pushTarget()
        const handlers = vm.$options[hook]
        const info = `${hook} hook`
        let ret
        if (handlers) {
            for (let i = 0, j = handlers.length; i < j; i++) {
                ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info)
            }
        }
        if (vm._hasHookEvent) {
            vm.$emit('hook:' + hook)
        }
        popTarget()
        return ret
    }

    Vue.prototype.__set_model = function(target, key, value, modifiers) {
        if (Array.isArray(modifiers)) {
            if (modifiers.indexOf('trim') !== -1) {
                value = value.trim()
            }
            if (modifiers.indexOf('number') !== -1) {
                value = this._n(value)
            }
        }
        target[key] = value
    }

    Vue.prototype.__set_sync = function(target, key, value) {
        target[key] = value
    }

    Vue.prototype.__get_orig = function(item) {
        if (isPlainObject(item)) {
            return item['$orig'] || item
        }
        return item
    }

    Vue.prototype.__get_value = function(dataPath, target) {
        return getTarget(target || this, dataPath)
    }


    Vue.prototype.__get_class = function(dynamicClass, staticClass) {
        return renderClass(staticClass, dynamicClass)
    }

    Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
        if (!dynamicStyle && !staticStyle) {
            return ''
        }
        const dynamicStyleObj = normalizeStyleBinding(dynamicStyle)
        const styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj
        return Object.keys(styleObj).map(name => `${hyphenate(name)}:${styleObj[name]}`).join(';')
    }

}
