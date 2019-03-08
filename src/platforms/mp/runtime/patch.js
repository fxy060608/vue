/* @flow */
import {
    pushTarget
} from 'core/observer/dep'

import diff from './diff'

function cloneWithData(vm) {
    // 确保当前 vm 所有数据被同步
    const dataKeys = [].concat(
        Object.keys(vm._data || {}),
        Object.keys(vm._computedWatchers || {}))

    const ret = dataKeys.reduce(function(ret, key) {
        ret[key] = vm[key]
        return ret
    }, Object.create(null))
    //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
    Object.assign(ret, vm.$mp.data || {})
    //remove observer
    return JSON.parse(JSON.stringify(ret))
}

function cloneWithMethods(data, vm) {
    Object.keys(vm.$options.methods || {}).forEach(method => {
        data[method] = vm[method]
    })
    return data
}

export const patch: Function = function(oldVnode, vnode) {
    if (vnode === null) {
        return console.log((this.$mp[this.mpType].is || this.$mp[this.mpType].route) + ' destroy')
    }
    if (this.mpType === 'page' || this.mpType === 'component') {
        const mpInstance = this.$mp[this.mpType]
        const data = cloneWithMethods(cloneWithData(this), this)
        data.__webviewId__ = mpInstance.data.__webviewId__
        const mpData = Object.create(null)
        Object.keys(data).forEach(key => { //仅同步 data 中有的数据
            mpData[key] = mpInstance.data[key]
        })
        const diffData = diff(data, mpData)
        console.log('[' + (mpInstance.is || mpInstance.route) + '][' + this._uid + ']差量数据', JSON.stringify(diffData))
        //disable dep collection
        pushTarget()
        //TODO 目前若 computed 引用了 props，则会引发再次 render watch 来同步 computed 属性
        mpInstance.setData(diffData)
    }
}
