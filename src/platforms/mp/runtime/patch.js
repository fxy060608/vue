/* @flow */
import diff from './diff'

import {
    flushCallbacks
} from './next-tick'

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

export const patch: Function = function(oldVnode, vnode) {
    if (vnode === null) { //destroy
        return
    }
    if (this.mpType === 'page' || this.mpType === 'component') {
        const mpInstance = this.$mp[this.mpType]
        const data = cloneWithData(this)
        data.__webviewId__ = mpInstance.data.__webviewId__
        const mpData = Object.create(null)
        Object.keys(data).forEach(key => { //仅同步 data 中有的数据
            mpData[key] = mpInstance.data[key]
        })
        const diffData = diff(data, mpData)
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
