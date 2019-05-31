package.json
.eslintrc.js
scripts/alias.js
scripts/config.js
//因为需要等小程序 ready(因为组件 attached 在页面 onLoad（生成页面 vm） 之前，
//只有 ready 在 onLoad 之后) 后，才可以处理父子组件关系，故调整 vue 的生命周期
src/core/util/debug.js(formatComponentName __MP__)
src/core/instance/init.js(initInjections(vm), initProvide(vm),callHook(vm, 'created'))
src/core/observer/scheduler.js(export const queue)
src/platforms/web/runtime/modules/style.js transformUnit

//weex
src/platforms/weex/runtime/node-ops u-text
src/platforms/weex/runtime/modules/attrs
src/platforms/weex/compiler/modules/recycle-list/text
src/platforms/weex/util/element isReservedTag (switch)
    
    
    
