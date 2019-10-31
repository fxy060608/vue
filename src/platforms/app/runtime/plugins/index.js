import {
  stringifyClass
} from 'web/util/class'

import {
  normalizeStyleBinding
} from 'web/util/style'

import {
    queue
} from 'core/observer/scheduler'

import callHook from './call-hook'

export default {
  install(Vue) {

    Vue.prototype._$queue = queue

    Vue.prototype.__call_hook = callHook
    // 运行时需要格式化 class,style
    Vue.prototype._$stringifyClass = stringifyClass
    Vue.prototype._$normalizeStyleBinding = normalizeStyleBinding
  }
}
