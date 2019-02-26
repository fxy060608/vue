/* @flow */

import Vue from 'core/index'
import {
    isPlainObject
} from 'shared/util'

import {
    mustUseProp,
    isReservedTag,
    isReservedAttr,
    getTagNamespace,
    isUnknownElement
} from 'mp/util/index'

import {
    patch
} from './patch'
import {
    mountComponent
} from './mountComponent'
import {
    parseEvents,
    parseListeners
} from './events-parser'

// install platform specific utils
Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag
Vue.config.isReservedAttr = isReservedAttr
Vue.config.getTagNamespace = getTagNamespace
Vue.config.isUnknownElement = isUnknownElement


// install platform patch function
Vue.prototype.__patch__ = patch

// public mount method
Vue.prototype.$mount = function(
    el ?: string | Element,
    hydrating ?: boolean
): Component {
    return mountComponent(this, el, hydrating)
}

Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
        return item['$orig'] || item
    }
    return item
}

Vue.prototype.__get_event = function(options) {
    const events = Object.create(null)
    Object.keys(options).forEach(eventId => {
        const eventOpts = options[eventId]
        if (eventOpts.component) {
            if (!this.$mp.listeners) {
                this.$mp.listeners = Object.create(null)
            }
            this.$mp.listeners[eventId] = parseListeners(eventOpts, this)
        }
        events[eventId] = parseEvents(eventOpts, this)
    })
    return events
}

export default Vue
