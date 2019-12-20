import {
    pushTarget,
    popTarget
} from 'core/observer/dep'

import {
    invokeWithErrorHandling
} from 'core/util/index'

export default  function callHook(hook, args) {
    const vm = this
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget()
    const handlers = vm.$options[hook]
    const info = `${hook} hook`
    let ret
    if (handlers) {
        for (let i = 0, j = handlers.length; i < j; i++) {
            ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info)
        }
    }
    if (vm._hasHookEvent) {
        vm.$emit('hook:' + hook, args)
    }
    popTarget()
    return ret
}