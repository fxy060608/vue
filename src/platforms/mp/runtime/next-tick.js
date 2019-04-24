/* @flow */

import {
    handleError,
    nextTick as nextVueTick
} from 'core/util/index'

import {
    queue
} from 'core/observer/scheduler'

export function flushCallbacks(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (process.env.VUE_APP_DEBUG) {
            const mpInstance = vm.$scope
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']')
        }
        const copies = vm.__next_tick_callbacks.slice(0)
        vm.__next_tick_callbacks.length = 0
        for (let i = 0; i < copies.length; i++) {
            copies[i]()
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(watcher => vm._watcher === watcher)
}

export function nextTick(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(process.env.VUE_APP_DEBUG){
            const mpInstance = vm.$scope
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick')
        }
        return nextVueTick(cb, vm)
    }else{
        if(process.env.VUE_APP_DEBUG){
            const mpInstance = vm.$scope
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextMPTick')
        }
    }
    let _resolve
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = []
    }
    vm.__next_tick_callbacks.push(() => {
        if (cb) {
            try {
                cb.call(vm)
            } catch (e) {
                handleError(e, vm, 'nextTick')
            }
        } else if (_resolve) {
            _resolve(vm)
        }
    })
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(resolve => {
            _resolve = resolve
        })
    }
}
