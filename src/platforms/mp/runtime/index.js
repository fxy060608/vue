/* @flow */

import Vue from 'core/index'
import { noop } from 'shared/util'

import {
  mustUseProp,
  isReservedTag,
  isReservedAttr,
  getTagNamespace,
  isUnknownElement
} from 'web/util/index'

// install platform specific utils
Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag
Vue.config.isReservedAttr = isReservedAttr
Vue.config.getTagNamespace = getTagNamespace
Vue.config.isUnknownElement = isUnknownElement


// install platform patch function
Vue.prototype.__patch__ = noop

// public mount method
Vue.prototype.$mount = function (): Component {
  return this
}

export default Vue
