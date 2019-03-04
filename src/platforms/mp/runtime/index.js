/* @flow */

import Vue from 'core/index'

import {
    patch
} from './patch'

import {
    mountComponent
} from './mountComponent'

import {
    internalMixin
} from './internal'

import {
    lifecycleMixin
} from './lifecycle'


// install platform patch function
Vue.prototype.__patch__ = patch

// public mount method
Vue.prototype.$mount = function(
    el ?: string | Element,
    hydrating ?: boolean
): Component {
    return mountComponent(this, el, hydrating)
}

lifecycleMixin(Vue)
internalMixin(Vue)

export default Vue
