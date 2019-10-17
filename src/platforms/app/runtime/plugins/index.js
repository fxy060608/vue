import callHook from './call-hook'

export default {
  install(Vue) {

    Vue.prototype._m = function renderStatic() {
      return this._e()
    }

    Vue.prototype.__call_hook = callHook
  }
}
