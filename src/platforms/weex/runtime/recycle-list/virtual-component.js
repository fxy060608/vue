/* @flow */

// https://github.com/Hanks10100/weex-native-directive/tree/master/component

import { mergeOptions, def, noop, isPlainObject } from 'core/util/index'
import Watcher from 'core/observer/watcher'
import { initProxy } from 'core/instance/proxy'
import { initState, getData } from 'core/instance/state'
import { initRender } from 'core/instance/render'
import { initEvents } from 'core/instance/events'
import { initProvide, initInjections } from 'core/instance/inject'
import { initLifecycle, callHook } from 'core/instance/lifecycle'
import { initInternalComponent, resolveConstructorOptions } from 'core/instance/init'
import { registerComponentHook, updateComponentData, updateVirtualRef } from '../../util/index'

let uid = 0

function getComponentState (vm: Component): Object {
  const _data = vm.$options.data
  const _computed = vm.$options.computed || {}
  const data = vm._data
    ? Object.assign({}, vm._data)
    : typeof _data === 'function'
      ? getData(_data, vm)
      : _data || {}
  const computed = {}
  for (const key in _computed) {
    computed[key] = vm[key]
  }
  const state = Object.assign({}, data, computed)
  return state
}

// override Vue.prototype._init
function initVirtualComponent (options: Object = {}) {
  const vm: Component = this
  const componentId = options.componentId
  def(vm, '_vmTemplate', options.vmTemplate)

  // virtual component uid
  vm._uid = componentId || `virtual-component-${uid++}`

  // a flag to avoid this being observed
  vm._isVue = true

  // merge options
  if (options && options._isComponent) {
    // optimize internal component instantiation
    // since dynamic options merging is pretty slow, and none of the
    // internal component options needs special treatment.
    initInternalComponent(vm, options)
  } else {
    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    )
  }

  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    initProxy(vm)
  } else {
    vm._renderProxy = vm
  }

  vm._self = vm
  initLifecycle(vm)
  initEvents(vm)
  initRender(vm)
  callHook(vm, 'beforeCreate')
  initInjections(vm) // resolve injections before data/props
  initState(vm)
  initProvide(vm) // resolve provide after data/props
  callHook(vm, 'created')

  registerComponentHook(componentId, 'lifecycle', 'attach',
    (instance: WeexComponentHookInstance) => {
      updateVirtualRef(vm, instance && instance.refs)

      callHook(vm, 'beforeMount')

      new Watcher(
        vm,
        () => getComponentState(vm),
        () => vm._update(vm._vnode, false)
      )

      vm._isMounted = true
      callHook(vm, 'mounted')
    })

  registerComponentHook(componentId, 'lifecycle', 'update',
    (instance: WeexComponentHookInstance) => {
      updateVirtualRef(vm, instance && instance.refs)
      vm._update(vm._vnode, false)
    })

  registerComponentHook(
    componentId,
    'lifecycle',
    'syncState',
    (id, propsData) => {
      if (isPlainObject(propsData)) {
        for (const key in propsData) {
          vm[key] = propsData[key]
        }
      }
      return getComponentState(vm)
    }
  )

  registerComponentHook(componentId, 'lifecycle', 'detach',
    (instance: WeexComponentHookInstance) => {
      updateVirtualRef(vm, instance && instance.refs, true)
      vm.$destroy()
      if (vm._vmTemplate) {
      // $flow-disable-line
        vm._vmTemplate.removeVirtualComponent(vm._uid)
        delete vm._vmTemplate
      }
    })
}

// override Vue.prototype._update
function updateVirtualComponent (vnode?: VNode) {
  const vm: Component = this
  const componentId = vm.$options.componentId
  if (vm._isMounted) {
    callHook(vm, 'beforeUpdate')
  }
  vm._vnode = vnode
  if (vm._isMounted && componentId) {
    // TODO: data should be diffed before sending to native
    const data = getComponentState(vm)
    updateComponentData(componentId, data, () => {
      callHook(vm, 'updated')
    })
  }
}

function initVirtualComponentTemplate (options: Object = {}) {
  const vm: Component = this

  // virtual component template uid
  vm._uid = `virtual-component-template-${uid++}`

  // a flag to avoid this being observed
  vm._isVue = true
  // merge options
  if (options && options._isComponent) {
    // optimize internal component instantiation
    // since dynamic options merging is pretty slow, and none of the
    // internal component options needs special treatment.
    initInternalComponent(vm, options)
  } else {
    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    )
  }

  vm._self = vm
  initEvents(vm)
  initRender(vm)
  initState(vm)

  this.registerVirtualComponent()
}

// listening on native callback
export function resolveVirtualComponent (vnode: MountedComponentVNode): VNode {
  const BaseCtor = vnode.componentOptions.Ctor
  const VirtualComponent = BaseCtor.extend({})
  const originalEmit = VirtualComponent.prototype.$emit
  VirtualComponent.prototype._init = initVirtualComponent
  VirtualComponent.prototype._update = updateVirtualComponent
  VirtualComponent.prototype.$emit = function $emit (...args) {
    const componentId = this._uid
    const vmTemplate = this._vmTemplate
    if (componentId && vmTemplate) {
      args.push(componentId)
      originalEmit.apply(vmTemplate, args)
    }
    return originalEmit.apply(this, args)
  }

  vnode.componentOptions.Ctor = BaseCtor.extend({
    methods: {
      registerVirtualComponent () {
        const vm: Component = this
        def(vm, '_virtualComponents', {})

        registerComponentHook(
          String(vm._uid),
          'lifecycle',
          'create',

          // create virtual component
          (componentId, propsData) => {
            const subVm = new VirtualComponent({
              vmTemplate: vm,
              componentId,
              propsData
            })
            subVm._uid = componentId
            if (vm._virtualComponents) {
              vm._virtualComponents[componentId] = subVm
            }

            // send initial data to native
            return getComponentState(subVm)
          }
        )
      },
      removeVirtualComponent (componentId) {
        delete this._virtualComponents[componentId]
      }
    },
    destroyed () {
      delete this._virtualComponents
    }
  })
  vnode.componentOptions.Ctor.prototype._init = initVirtualComponentTemplate
  vnode.componentOptions.Ctor.prototype._update = noop
}
