/* @flow */

import Vue from 'core/index'
import { extend } from 'shared/util'
import { mountComponent } from 'core/instance/lifecycle'
import Document from './vdom/Document'
import {
  mustUseProp,
  isReservedTag,
  isReservedAttr,
  getTagNamespace,
  isUnknownElement
} from '../util/index'

import { patch } from './patch'
import platformDirectives from './directives/index'
import platformComponents from './components/index'
import plugin from './plugins/index'
// install platform specific utils
Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag
Vue.config.isReservedAttr = isReservedAttr
Vue.config.getTagNamespace = getTagNamespace
Vue.config.isUnknownElement = isUnknownElement

// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives)
extend(Vue.options.components, platformComponents)

// install platform patch function
Vue.prototype.__patch__ = patch

// public mount method
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  if (this.$options.mpType === 'page') {
    const doc = new Document(this.$options.pageId, this.$options.pagePath)
    el = doc.createComment('root')
    el.hasAttribute = el.removeAttribute = function(){} // hack for patch
    doc.documentElement.appendChild(el)
  }
  return mountComponent(this, el, hydrating)
}
Vue.use(plugin)
export default Vue
