/* @flow */
import diff from './diff'

import {
  flushCallbacks
} from './next-tick'

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  const ret = Object.create(null)
  const dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}))

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key]
    return ret
  }, ret)

  // vue-composition-api
  const rawBindings = vm.__secret_vfa_state__ && vm.__secret_vfa_state__.rawBindings
  if (rawBindings) {
    Object.keys(rawBindings).forEach(key => {
      ret[key] = vm[key]
    })
  }
  
  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {})
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name
    ret['value'] = vm.value
  }

  return JSON.parse(JSON.stringify(ret))
}

export const patch: Function = function(oldVnode, vnode) {
  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    const mpInstance = this.$scope
    let data = Object.create(null)
    try {
      data = cloneWithData(this)
    } catch (err) {
      console.error(err)
    }
    data.__webviewId__ = mpInstance.data.__webviewId__
    const mpData = Object.create(null)
    Object.keys(data).forEach(key => { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key]
    })
    const diffData = this.$shouldDiffData === false ? data : diff(data, mpData)
    if (Object.keys(diffData).length) {
      if (process.env.VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData))
      }
      this.__next_tick_pending = true
      mpInstance.setData(diffData, () => {
        this.__next_tick_pending = false
        flushCallbacks(this)
      })
    } else {
      flushCallbacks(this)
    }
  }
}
