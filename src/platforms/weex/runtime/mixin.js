/* @flow */
/**
 * Internal mixin of Weex.
 */
import { initTimerFunc, resetTimerFunc } from 'core/util/next-tick'

function isRootComponent (vm: Component): boolean {
  return !!(vm.$options && vm.$options.el)
}

export default {
  beforeCreate () {
    // only affect root component
    if (isRootComponent(this)) {
      initTimerFunc()
    }
  },
  destroyed () {
    // only affect root component
    if (isRootComponent(this)) {
      resetTimerFunc()
    }
  }
}
