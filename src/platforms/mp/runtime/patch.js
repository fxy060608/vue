/* @flow */
import {
    pushTarget
} from 'core/observer/dep'

import diff from './diff'

function getVmData(vm) {
    // 确保当前 vm 所有数据被同步
    const dataKeys = [].concat(
        Object.keys(vm._data || {}),
        Object.keys(vm._computedWatchers || {}))

    const ret = dataKeys.reduce(function (ret, key) {
        ret[key] = vm[key]
        return ret
    }, {})
    //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
    Object.assign(ret, vm.$mp.data || {})

    return ret
}

export const patch: Function = function (oldVnode, vnode) {
    if (vnode === null) {
        return console.log(this.$mp[this.mpType].is + ' destroy')
    }
    if (this.mpType === 'page' || this.mpType === 'component') {
        const mpInstance = this.$mp[this.mpType]
        const data = JSON.parse(JSON.stringify(getVmData(this)))
        data.__webviewId__ = mpInstance.data.__webviewId__
        const mpData = Object.create(null)
        Object.keys(data).forEach(key => { //仅同步 data 中有的数据
            mpData[key] = mpInstance.data[key]
        })
        const diffData = diff(data, mpData)
        console.log('[' + mpInstance.is + ']['+this._uid+']差量数据', JSON.stringify(diffData))
        //disable dep collection
        pushTarget()
        mpInstance.setData(diffData)
    }
}
